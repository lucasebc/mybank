import HeaderComponent from '@/components/HeaderComponent'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceComponent from '@/components/TotalBalanceComponent'
import React from 'react'

const Home = () => {
  const user = {firstName:'Lucas', lastName: 'Emanuel', email: 'lucasebc@outlook.com'}

  return (
    <section className='home'>
      <div className="home-content">
        <header className="home-header">
          <HeaderComponent type='greeting' title='Welcome' user={user?.firstName || 'guest'} subtext='Access and manage your accounts' />
          <TotalBalanceComponent accounts={[]} totalBanks={1} totalCurrentBalance={5000.35}></TotalBalanceComponent>
        </header>

        {/* recent transactions */}
      </div>

      <RightSidebar user={user} transactions={[]} banks={[{},{}]}></RightSidebar>
    </section>
  )
}

export default Home