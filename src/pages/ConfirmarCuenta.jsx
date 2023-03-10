import { useEffect, useState } from "react"
import {useParams, useNavigate} from 'react-router-dom'
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const ConfirmarCuenta = () => {


  const [alerta, setAlerta] = useState({})
  const navigate = useNavigate()
  const params = useParams()
  const {id} = params

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const {data} = await clienteAxios(`/usuarios/confirmar/${id}`)
        navigate('/',{state: {
          confirmada: data.msg
        }})
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    confirmarCuenta()
  }, [])

  const {msg} = alerta

  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Confirma tu cuenta y comienza a crear tus {''} <span className="text-slate-700">Proyectos</span></h1>
        <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
          {msg && <Alerta alerta={alerta} />}
          <p className="block text-center text-slate-500 uppercase text-sm">El token ya expiró. Revisa tu correo para ver las instrucciones</p>
        </div>
    </>
  )
}

export default ConfirmarCuenta