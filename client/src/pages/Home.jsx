import React from 'react'
import Advertise from '../components/advertise'
import Browse from '../components/Browse'
import Popular from '../components/Popular'
import ThingsWeShare from '../components/Thingsshare'
import Footer from '../components/Fotter'


const Home = () => {
  return (
    <>
      <Advertise/>
      <Browse/>
      <Popular/>
      <ThingsWeShare/>
      
      <Footer/>
    </>
  )
}

export default Home