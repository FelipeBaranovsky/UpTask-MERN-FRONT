import { formatearFecha } from "../utils/formatearFecha"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"

const Tarea = ({tarea}) => {

    const {nombre,descripcion,fechaEntrega,prioridad, estado, _id} = tarea
    const {handleModalEditarTarea, handleModalEliminarTarea, completarTarea} = useProyectos()
    const admin = useAdmin()

  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>
            <p className="mb-4 text-2xl">{nombre}</p>
            <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
            <p className="mb-1 text-sm text-gray-800">Fecha límite: <span className="font-bold">{formatearFecha(fechaEntrega)}</span></p>
            <p className="mb-1 text-gray-600">Prioridad: <span className="font-bold">{prioridad}</span></p>
        </div>
        <div className="flex gap-2">
            {admin && (
                <button
                    className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    onClick={() => {handleModalEditarTarea(tarea)}}
                >Editar</button>
            )}
            
            <button
                className={`${estado ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-600 hover:bg-gray-700'} transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                onClick={() => completarTarea(_id)}
            >{estado ? 'Completa' : 'Incompleta'}</button>
            
            {admin && (
                <button
                    className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    onClick={() => {handleModalEliminarTarea(tarea)}}
                >Eliminar</button>
            )}
        </div>
    </div>
  )
}

export default Tarea