import './modal.css'

const Modal = (props) => {
     const enviarFormulario = (e) => {
          e.preventDefault()

          const dadosFormulario = Object.fromEntries(
               new FormData(e.currentTarget)
          )

          props.onSubmit(dadosFormulario)
     }

  return (
    <section id='overlay' onClick={() => props.onClose()}>
      <section className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="title">
               <h2>{props.titulo}</h2>
               <div onClick={() => props.onClose()}>
                    <i className="fa-solid fa-xmark"></i>
               </div>
          </div>

          <form onSubmit={enviarFormulario}>
               {props.formulario}
               <button type='submit' aria-label='Btn-salvar'>Salvar</button>
          </form>
      </section>
    </section>
  )
}

export default Modal
