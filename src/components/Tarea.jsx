import { formatearFecha } from "../utils/formatearFecha"

const Tarea = ({tarea}) => {

    const {nombre,descripcion,fechaEntrega,prioridad, estado, _id} = tarea

  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>
            <p className="mb-4 text-2xl">{nombre}</p>
            <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
            <p className="mb-1 text-xl text-gray-800">Fecha límite: <span className="font-bold">{formatearFecha(fechaEntrega)}</span></p>
            <p className="mb-1 text-gray-600">Prioridad: <span className="font-bold">{prioridad}</span></p>
        </div>
        <div className="flex gap-2">
            <button
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            >Editar</button>
            {estado ? (
                <button
                    className="bg-sky-600 hover:bg-sky-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                >Completa</button>
            ) : (
                <button
                    className="bg-gray-600 hover:bg-gray-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                >Incompleta</button>
            )}
            
            <button
                className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            >Eliminar</button>
        </div>
    </div>
  )
}

export default Tarea