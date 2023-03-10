import { useState, useEffect, useRef } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const NuevoPassword = () => {

    const params = useParams()
    const {token} = params
    const navigate = useNavigate()
    const [alerta, setAlerta] = useState({})
    const [tokenValido, setTokenValido] = useState(false)
    const [password, setPassword] = useState('')
    const dataFetch = useRef(false)


    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`)
                setTokenValido(true)
                dataFetch.current = true
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }

            if(dataFetch.current)
                return

        }
        comprobarToken()
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(password.length < 6) {
            setAlerta({
                msg: 'El Password debe contener un mínimo de 6 caracteres',
                error: true
            })
            return
        }
        try {
            const {data} = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {password})
            navigate('/',{state: {
                reestablecida: data.msg
              }})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
        //TODO: Conexion con API Backend...

    }

    const {msg} = alerta

  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Restablece tu password y no pierdas acceso a tus {''} <span className="text-slate-700">Proyectos</span></h1>
        {msg && <Alerta alerta={alerta} />}
        {tokenValido && (

            <form 
                className="my-10 bg-white shadow rounded-lg p-10"
                onSubmit={handleSubmit}
            >

            <div className="my-5">
                <label 
                    className="uppercase text-gray-600 block text-xl font-bold" 
                    htmlFor="password"
                >Nuevo Password</label>
                <input 
                    id="password"
                    type="password" 
                    placeholder="Escribe tu Nuevo Password"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <input 
                type="submit"
                value="Guardar Nuevo Password"
                className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
            />

            </form>
        )}
        
    </>
  )
}

export default NuevoPassword