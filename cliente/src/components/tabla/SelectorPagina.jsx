import { useState, useEffect, Fragment } from "react";
import Slider from '@mui/material/Slider';

export default function SelectorPagina({ count, totalElementos, setVistas, vistas, update }) {
    const handleVistas = (event, newValue) => {
        setVistas(newValue);
        if (vistas !== newValue) {
            update();
        }
    }
    const [contador, setContador] = useState(count);
    return (
        <Fragment>
            <p>
                Selecciona la cantidad de elementos a mostrar
            </p>
            <div className="flex flex-row">
                <Slider
                    aria-label="Temperature"
                    defaultValue={contador}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={totalElementos}
                    onChange={handleVistas}
                />
                <p>
                    Total de elementos {totalElementos}
                </p>
            </div>
        </Fragment>
    )
}
