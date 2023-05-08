import React from 'react'

// Partials
import Desktop from './Devices/Desktop'
import Mobile from './Devices/Mobile'

export default function Header() {
  return (
    <>
      <div className='mb-[4rem]'>
        <div className="w-full on_mobile:hidden">
          <Desktop />
        </div>
        <div className="w-full fixed on_desktop:hidden">
          <Mobile />
        </div>
      </div>
    </>
  )
}
