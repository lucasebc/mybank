'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../server/appwrite"
import { cookies } from "next/headers"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { plaidCLient } from "@/lib/plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions"

const {APPWRITE_DATABASE_ID: DATABASE_ID, 
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID, 
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID} = process.env;

export const signIn = async (userData: signInProps)=>{
    try {
        const { account } = await createAdminClient();

        const response = await account.createEmailPasswordSession(userData.email, userData.password) 

        cookies().set("appwrite-session", response.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(response)

    } catch (error) {
        console.error(error)
    }
}

export const signUp = async ({password, ...userData}: SignUpParams)=>{

    let newUserAccount;

    try {
        const { database, account } = await createAdminClient();

        newUserAccount = await account.create(ID.unique(), userData.email, password, `${userData.firstName} ${userData.lastName}`);

        if(!newUserAccount) throw new Error('Error! User not created.')

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal'
        });

        if(!dwollaCustomerUrl) throw new Error('Error! Dwolla user not created.');

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
        
        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!, 
            ID.unique(), 
            {
                ...userData, 
                userId: newUserAccount.$id, 
                dwollaCustomerId, 
                dwollaCustomerURL: dwollaCustomerUrl
            }
        );

        const session = await account.createEmailPasswordSession(userData.email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUser)
    } catch (error) {
        console.error(error)
    }
}

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export const logout = async ()=>{
    try {
        const { account} = await createSessionClient()
        cookies().delete('appwrite-session')
        await account.deleteSession('current')

        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export const createLinkToken = async (user:User) =>{
    try {
     const tokenParams = {
        user: {
            client_user_id: user.$id,

        },
        client_name: `${user.firstName} ${user.lastName}`,
        products: ['auth'] as Products[],
        language: 'en',
        country_codes: ['US', 'PT'] as CountryCode[],

     }   

     const response = await plaidCLient.linkTokenCreate(tokenParams)

     return parseStringify({linkToken: response.data.link_token})
    } catch (error) {
        console.error(error)
    }
}

export const createBankAccount = async ({userId,
bankId,
accountId,
accessToken,
sharableId}:createBankAccountProps)=>{
    try {
        const {database} = await createAdminClient();

        const bankAccount = await database.createDocument(
        DATABASE_ID!, BANK_COLLECTION_ID!, ID.unique(),{
            userId,
            bankId,
            accountId,
            accessToken,
            shareableId: sharableId,
            })
    } catch (error) {
        
    }
}

export const exchangePublicToken = async ({
    publicToken,user
}:exchangePublicTokenProps) => {
try {

    //get public token
    const response = await plaidCLient.itemPublicTokenExchange({public_token:publicToken,})

    const accessToken = response.data.access_token
    const itemId = response.data.item_id

    // get account info from plaid
    const accountsResponse = await plaidCLient.accountsGet({access_token: accessToken,})

    const accountData = accountsResponse.data.accounts[0]

    // create a processor token for dwolla
    const request: ProcessorTokenCreateRequest = {
        access_token:accessToken, 
        account_id:accountData.account_id, 
        processor:'dwolla' as ProcessorTokenCreateRequestProcessorEnum
    }

    const processorTokenResponse = await plaidCLient.processorTokenCreate(request)
    const processorToken = processorTokenResponse.data.processor_token

    //create a funding source url for the account using the processor token
    const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId:user.dwollaCustomerId,
        processorToken,
        bankName: accountData.name
    })

    // if funding source is not create throw error
    if(!fundingSourceUrl) throw Error;

    await createBankAccount({
        userId: user.$id,
        bankId: itemId,
        accountId:accountData.account_id, accessToken, fundingSourceUrl, sharableId: encryptId(accountData.account_id)
    })

    // revalidates path to reflect changes
    revalidatePath('/')

    return parseStringify({publicTokenExchange: 'complete'})

} catch (error) {
    console.error(error)
}
}