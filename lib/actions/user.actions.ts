'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../server/appwrite"
import { cookies } from "next/headers"
import { parseStringify } from "../utils"

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

export const signUp = async (userData: SignUpParams)=>{
    try {
        const { account } = await createAdminClient();

        const newUser = await account.create(ID.unique(), userData.email, userData.password, `${userData.firstName} ${userData.lastName}`);

        const session = await account.createEmailPasswordSession(userData.email, userData.password);

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
