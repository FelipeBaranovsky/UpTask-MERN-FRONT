import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const PreviewProyecto = ({proyecto}) => {

    const {auth} = useAuth()
    const {nombre, _id, cliente, creador} = proyecto
    
  return (
    <div className="border-b p-5 flex justify-between">
        <div className="flex items-center gap-5">
            <p className="flex-1">
                {nombre}
                
            </p>
            <p className="text-sm text-gray-500 uppercase">
                {cliente}
            </p>
            {auth._id !== creador && (
                <p className="p-1 text-xs rounded-lg text-white bg-green-500 font-bold uppercase">Colaborador</p>
            )}
        </div>
        
        <Link
            to={`${_id}`}
            className="text-gray-600 hover:text-black uppercase text-sm font-bold"
        >Ver Proyecto</Link>
    </div>
  )
}

export default PreviewProyecto