import { useState } from "react";
import {
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

export default function ShowPelicula({ pelicula, close }) {
    return (
        <div className="flex flex-col  border border-black rounded-lg bg-white ">
            <div className="text-right">
                <CloseIcon
                    onClick={() => close()}
                    className="cursor-pointer text-red-400 hover:text-red-900 "
                />
            </div>
        </div>
    )
}
