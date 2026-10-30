const dataConvertida = (data,tipo) => {
     if (!data) {
          return ''
     }

     if (tipo == 'modal') {
          return data.split('T')[0]
     }

     return new Date(data).toLocaleDateString('pt-br')
}

export default dataConvertida