import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios"
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client'

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [cargandoColab, setCargandoColab] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)



    const navigate = useNavigate()

    useEffect(() => {
        const obtenerProyectos = async () => {
            setCargando(true)
            try {
                const token = localStorage.getItem('token')
                if(!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const {data} = await clienteAxios('/proyectos', config)
                setProyectos(data)
                setCargando(false)
            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos()
      
    }, [])

    //Establecer com
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URI)
      }, [])
    
    const handleCargando = () => {
        setCargando(!cargando)
    }

    const mostrarAlerta = (alerta) => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 2000); 
    }

    const submitProyecto = async (proyecto) => {

        if(proyecto.id){
            await editarProyecto(proyecto)
        }else{
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 1000);

        } catch (error) {
            console.log(error);
        }
    }

    const nuevoProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/proyectos', proyecto, config)
            setProyectos([...proyectos, data])
            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 1000);

        } catch (error) {
            console.log(error);
        }
    }

    const obtenerProyecto = async (id) => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios(`/proyectos/${id}`, config) 
            setProyecto(data)
        } catch (error) {
            navigate('/proyectos')
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config) 

            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 1000);

        } catch (error) {
            console.log(error);
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTimeout(() => {
            setTarea({})
        }, 1000);
        
    }

    const submitTarea = async (tarea) => {

        if(tarea?.id){
            await editarTarea(tarea)
        } else{
            await crearTarea(tarea)
        }
        
    }

    const crearTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/tareas`, tarea, config) 

            setAlerta({
                msg: "Tarea creada Correctamente",
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                setModalFormularioTarea(false)
            }, 2000);

            //SocketIO
            socket.emit('nueva tarea', data)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })

            setTimeout(() => {
                setAlerta({})
            }, 3000);
        }
    }

    const editarTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config) 
            handleModalTarea()

            //SOCKET
            socket.emit('editar tarea', data)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })

            setTimeout(() => {
                setAlerta({})
            }, 3000);
        }
    }

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = (tarea) => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config) 
            
            
            //SOCKET
            socket.emit('eliminar tarea', tarea)

            setModalEliminarTarea(false)
            setTarea({})
            
        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async email => {
        setCargandoColab(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/proyectos/colaboradores`, {email}, config) 
            setColaborador(data)
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setColaborador({})
        } finally {
            setCargandoColab(false)
        }

    }

    const agregarColaborador = async (email) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config) 
            mostrarAlerta({
                msg: data.msg,
                error: false
            }) 
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
                navigate(`/proyectos/${proyecto._id}`)
            }, 1000);
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setColaborador({})
        }
    } 

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    } 

    const eliminarColaborador = async () => {
        try{
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config) 
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)

            mostrarAlerta({
                msg: data.msg,
                error: false
            }) 
            setColaborador({})
            setModalEliminarColaborador(false)
        } catch (error) {
            console.log(error.response);
        }
    }

    const completarTarea = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config) 
            
            //SOCKET
            socket.emit('cambiar estado', data)

            setTarea({})
            setAlerta({})

        } catch (error) {
            console.log(error.response);
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //SocketIO
    const submitTareasProyecto = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas,tarea]
        setProyecto(proyectoActualizado)
    }

    const submitEliminarTareas = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    const submitEditarTareas = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const submitCambiarEstado = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleCargando,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                cargandoColab,
                agregarColaborador,
                setAlerta,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                submitEliminarTareas,
                submitEditarTareas,
                submitCambiarEstado
            }}
        >{children}
        </ProyectosContext.Provider>
    )

}

export {
    ProyectosProvider
}

export default ProyectosContext