import './toast.css'

const Toast = (props) => {
  return (
    <section id='toast' style={props.tipo == 'error' ? {backgroundColor: "#dc0000"} : {backgroundColor: "#004f7a"}}>
      <p>{props.message}</p>
    </section>
  )
}

export default Toast
