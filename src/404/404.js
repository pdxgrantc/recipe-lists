import React from 'react'
import { Helmet } from 'react-helmet';

// Partials
import Header from '../Static/Header/Header'
import Footer from '../Static/Footer/Footer'


export default function FourOFour() {
    return (
        <>
            <Helmet>
                <title>404 - Page Not Found</title>
            </Helmet>
            <div className="bg-main_bg_color text-text_white h-[100vh] flex flex-col">
                <Header />
                <div className="w-full h-max basis-auto grow">
                    <div className='m-auto rounded-[10px] h-[80%] bg-black w-[90%]'>
                        <div className='flex gap-5 w-[100%] px-[4%] py-[3%] flex-col'>
                            <h1 className='text-[3rem] font-semibold'>404 Error - Page Not Found</h1>
                            <h2 className='text-[2rem] font-semibold'>Please try a different url.</h2>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
