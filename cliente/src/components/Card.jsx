import { useState } from 'react'
import defaultImg from '../assets/img-default.jpg'
import { Rating, Button } from '@mui/material';

export default function Card() {

    const [value, setValue] = useState(2);

    return (
        <div className="rounded-xl bg-white w-64  m-4">
            <div>
                <img className="h-64 w-64 rounded object-cover" src={defaultImg} alt="image" />
            </div>

            <div className="flex flex-col w-full justify-center  mt-4">
                <div className='flex flex-row justify-between items-center px-2'>
                    <span className="pl-2 capitalize">Titulo: </span>
                    <span className="pl-2 capitalize">Nombre Pelicula</span>
                </div>
                <div className='flex flex-row justify-between items-center px-2'>
                    <span className="pl-2 capitalize">Calificacion:</span>
                    <Rating
                        name="simple-controlled"
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    />
                </div>
                <Button variant="contained" color="success" className="w-full">Ver</Button>
            </div>
        </div>
    )
}