import { useState } from 'react'
import NavbarPage from '../components/NavbarPage'
import Card from '../components/Card'

import bgPage from '../assets/bg-page.jpg'

export default function Index() {
    const [generos, setGeneros] = useState([{
        "nombre": "Miedo"
    },
    {
        "nombre": "Comedia"
    },
    {
        "nombre": "Drama"
    },
    {
        "nombre": "Accion"
    },
    {
        "nombre": "Romance"
    },
    {
        "nombre": "Terror"
    }
    ])

    return (
        <div>
            <img src={bgPage} alt="bgLogin" style={{ width: "100%", height: "100%", position: "fixed", zIndex: "-1" }} />

            <div className="sticky top-0 z-50">
                <NavbarPage />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="col-span-1 md:col-span-9">
                    <div className="bg-slate-700 bg-opacity-60 rounded-b-xl">
                        <div className="flex flex-col justify-center items-center h-full">
                            <h2 className="text-4xl font-bold text-white">Bienvenido a la página principal</h2>
                            <h3 className='text-2xl font-bold text-white'>Aquí podrás ver las peliculas mas recientes</h3>
                        </div>

                        <div className='flex flex-row flex-wrap justify-center'>
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                                    return <Card key={index} />
                                })
                            }
                        </div>



                    </div>
                </div>

                <div className="col-span-1 md:col-span-3 ">
                    <div className="bg-slate-700 bg-opacity-60 h-screen rounded-b-xl w-full">
                        <div className="flex flex-col justify-center items-center h-full">
                            <h2 className="text-4xl font-bold text-white">Categorias</h2>

                            {
                                generos.map((genero, index) => {
                                    return (
                                        <div key={index} className="flex flex-row justify-center items-center">
                                            <h3 className='text-2xl font-bold text-white hover:text-gray-400 duration-500'>{genero.nombre}</h3>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                </div>

            </div>

        </div>

    )
}
