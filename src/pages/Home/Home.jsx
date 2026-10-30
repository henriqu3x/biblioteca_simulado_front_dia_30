import { useEffect, useState } from 'react'
import './home.css'
import api from '../../services/api'
import Toast from '../../components/Toast/Toast'
import Modal from '../../components/Modal/Modal'
import logo from '../../assets/logo-bg.png'
import { useAuth } from '../../contexts/AuthContext'
import dataConvertida from '../../services/dataConvertida'

const Home = () => {
     const [usuarios,setUsuarios] = useState([])
     const [autores,setAutores] = useState([])
     const [categorias,setCategorias] = useState([])
     const [livros,setLivros] = useState([])
     const [exemplares,setExemplares] = useState([])
     const [emprestimos,setEmprestimos] = useState([])
     const [devolucoes,setDevolucoes] = useState([])

     const [error,setError] = useState('')
     const [msg,setMsg] = useState('')

     const [tab,setTab] = useState('autores')
     
     const [modal,setModal] = useState({open:false,mode:'add',register:null})

     const {user,isAdmin,logout} = useAuth()

     const buscarAPI = async () => {
          try {
               setError('')

               const Usuarios = await api.get('/usuarios')
               const Autores = await api.get('/autores')
               const Categorias = await api.get('/categorias')
               const Livros = await api.get('/livros')
               const Exemplares = await api.get('/exemplares')
               const Emprestimos = await api.get('/emprestimos')
               const Devolucoes = await api.get('/devolucoes')

               setUsuarios(Usuarios.data)
               setAutores(Autores.data)
               setCategorias(Categorias.data)
               setLivros(Livros.data)
               setExemplares(Exemplares.data)
               setEmprestimos(Emprestimos.data)
               setDevolucoes(Devolucoes.data)
          } catch (error) {
               const message = error.response?.data?.error || error.response?.data?.message
               setError(message)
          }
     }

     useEffect(() => {
          buscarAPI()
     },[])

     //FILTROS 

     const livrosAtivos = livros.filter((e) => e.ativo)
     const exemplaresAtivos = exemplares.filter((e) => e.ativo)
     const exemplaresDisponiveis = exemplares.filter((e) => e.ativo && e.status == 'disponivel')
     const exemplaresEmprestados = exemplares.filter((e) => e.ativo && e.status == 'emprestado')
     const categoriasAtivas = categorias.filter((e) => e.ativo)
     const autoresAtivos = autores.filter((e) => e.ativo)

     const [inputBuscaLivro,setInputBuscaLivro] = useState('')
     const livrosFiltrados = livros.filter((e) => (!inputBuscaLivro || e.livro.titulo.includes(inputBuscaLivro) || e.autor.nome.includes(inputBuscaLivro) || e.livro.categoria.nome.includes(inputBuscaLivro)))

     const enviarFormulario = async (dadosFormulario) => {
          try {
               setError('')
               setMsg('')

               let result;
               if (modal.mode == 'att') {
                    result = await api.put(`/${tab}/${modal.register?.id}`, dadosFormulario)
               } else {
                    result = await api.post(`/${tab}`, dadosFormulario)

               }

               setMsg(result.data.message)

               const settersPorTab = {
                    usuarios: setUsuarios,
                    autores: setAutores,
                    categorias: setCategorias,
                    livros: setLivros,
                    exemplares: setExemplares,
                    emprestimos: setEmprestimos,
                    devolucoes: setDevolucoes
               }

               const setEntidade = settersPorTab[tab]
               const entidadeSalva = result.data.result

               setModal({open:false,mode:'add',register:null})

               if (modal.mode == 'att') {
                    setEntidade((entidades) => entidades.map((e) => e.id == entidadeSalva.id? entidadeSalva : e))
               } else {
                    setEntidade((entidades) => [...entidades, entidadeSalva])
               }

               buscarAPI()
          } catch (error) {
               const message = error.response?.data?.error || error.response?.data?.message
               setError(message)
          }
     }
     const arquivar = async (id) => {
          try {
               setError('')
               setMsg('')

               const result = await api.patch(`/${tab}/${id}`)

               setMsg(result.data.message)

               const settersPorTab = {
                    usuarios: setUsuarios,
                    autores: setAutores,
                    categorias: setCategorias,
                    livros: setLivros,
                    exemplares: setExemplares,
                    emprestimos: setEmprestimos,
                    devolucoes: setDevolucoes
               }

               const setEntidade = settersPorTab[tab]
               const entidadeSalva = result.data.result

               setEntidade((entidades) => entidades.map((e) => e.id == entidadeSalva.id? entidadeSalva : e))

               buscarAPI()
          } catch (error) {
               const message = error.response?.data?.error || error.response?.data?.message
               setError(message)
          }
     }
     const deletar = async (id) => {
          try {
               setError('')
               setMsg('')

               const result = await api.delete(`/${tab}/${id}`)

               setMsg(result.data.message)

               const settersPorTab = {
                    usuarios: setUsuarios,
                    autores: setAutores,
                    categorias: setCategorias,
                    livros: setLivros,
                    exemplares: setExemplares,
                    emprestimos: setEmprestimos,
                    devolucoes: setDevolucoes
               }

               const setEntidade = settersPorTab[tab]
               const entidadeDeletada = result.data.result

               if (tab == 'livros') {
                    setEntidade((entidades) => entidades.filter((e) => e.id != entidadeDeletada.livro_autor[0].id))
               } else {
                    setEntidade((entidades) => entidades.filter((e) => e.id != entidadeDeletada.id))
               }

               buscarAPI()
          } catch (error) {
               const message = error.response?.data?.error || error.response?.data?.message
               setError(message)
          }
     }

     let conteudo;
     let formulario;
     let filtros;
     switch (tab) {
          case 'autores':
               conteudo = autores.map((e) => 
                    <article className="card-content">
                         <div className="box-text">
                              <span>{e.nome}</span>
                              <div>
                                   <p>{e.nascionalidade}</p>
                                   <p>• {dataConvertida(e.data_nascimento)}</p>
                                   <p>• {e.ativo? '🟢Ativo' : '🔴Inativo'}</p>
                              </div>
                         </div>
                         <div className="box-btns">
                              <button disabled={!isAdmin} aria-label='btn' onClick={() => setModal({open:true, mode:'att',register:e})}>Editar</button>
                              <button disabled={!isAdmin} aria-label='btn' onClick={() => arquivar(e.id)}>{e.ativo ? 'Arquivar' : 'Desarquivar'}</button>
                         </div>
                    </article>
               )
               formulario = (
                    <>
                         <div className="label-input">
                              <label htmlFor="nome">Nome</label>
                              <input type="text" required id='nome' name='nome' placeholder='Digite o nome do autor' defaultValue={modal.register?.nome || ''}/>
                         </div>
                         <div className="label-input">
                              <label htmlFor="nascionalidade">Nacionalidade</label>
                              <input type="text" required id='nascionalidade' name='nascionalidade' placeholder='Digite o nascionalidade do autor' defaultValue={modal.register?.nascionalidade || ''}/>
                         </div>
                         <div className="label-input">
                              <label htmlFor="data_nascimento">Data nascimento</label>
                              <input type="date" required id='data_nascimento' name='data_nascimento' defaultValue={dataConvertida(modal.register?.data_nascimento, 'modal') || ''}/>
                         </div>
                    </>
               )
               break;
          case 'categorias':
               conteudo = categorias.map((e) => 
                    <article className="card-content">
                         <div className="box-text">
                              <span>{e.nome}</span>
                              <div>
                                   <p className='descricao'>{e.descricao}</p>
                                   <p>• {e.ativo? '🟢Ativo' : '🔴Inativo'}</p>
                              </div>
                         </div>
                         <div className="box-btns">
                              <button disabled={!isAdmin} aria-label='btn' onClick={() => setModal({open:true, mode:'att',register:e})}>Editar</button>
                              <button disabled={!isAdmin} aria-label='btn' onClick={() => arquivar(e.id)}>{e.ativo ? 'Arquivar' : 'Desarquivar'}</button>
                         </div>
                    </article>
               )
               formulario = (
                    <>
                         <div className="label-input">
                              <label htmlFor="nome">Nome</label>
                              <input type="text" required id='nome' name='nome' placeholder='Digite o nome da descricao' defaultValue={modal.register?.nome || ''}/>
                         </div>
                         <div className="label-input">
                              <label htmlFor="descricao">Descrição</label>
                              <textarea type="text" required id='descricao' name='descricao' placeholder='Digite o descricao da descricao' defaultValue={modal.register?.descricao || ''}/>
                         </div>
                    </>
               )
               break;
          case 'livros':
               conteudo = livrosFiltrados.map((e) => 
                    <article className="card-content">
                         <div className="box-text">
                              <span>{e.livro.titulo}</span>
                              <div>
                                   <p>{e.livro.isbn}</p>
                                   <p>• {e.livro.categoria.nome}</p>
                                   <p>• {e.autor.nome}</p>
                                   <p>• {e.ativo? '🟢Ativo' : '🔴Inativo'}</p>
                              </div>
                         </div>
                         <div className="box-btns">
                              <button disabled={!isAdmin} aria-label='btn' onClick={() => setModal({open:true, mode:'att',register:e})}>Editar</button>
                              <button disabled={!isAdmin} aria-label='btn' onClick={() => arquivar(e.id)}>{e.ativo ? 'Arquivar' : 'Desarquivar'}</button>
                              <button disabled={!isAdmin} aria-label='btn' onClick={() => deletar(e.livro.id)}>Deletar</button>
                         </div>
                    </article>
               )
               formulario = (
                    <>
                         <div className="label-input">
                              <label htmlFor="isbn">Isbn</label>
                              <input type="text" required id='isbn' name='isbn' placeholder='Digite o isbn do livro' defaultValue={modal.register?.livro.isbn || ''}/>
                         </div>
                         <div className="label-input">
                              <label htmlFor="titulo">Titulo</label>
                              <input type="text" required id='titulo' name='titulo' placeholder='Digite o titulo do livro' defaultValue={modal.register?.livro.titulo || ''}/>
                         </div>
                         <div className="label-input">
                              <label htmlFor="ano_publicacao">Ano publicacao</label>
                              <input type="number" required id='ano_publicacao' name='ano_publicacao' placeholder='Digite o ano de publicacao do livro' defaultValue={modal.register?.livro.ano_publicacao || ''}/>
                         </div>
                         <div className="label-input">
                              <label htmlFor="edicao">Edicao</label>
                              <input type="text" required id='edicao' name='edicao' placeholder='Digite a edicao do livro' defaultValue={modal.register?.livro.edicao || ''}/>
                         </div>
                         <div className="label-input">
                              <label htmlFor="editora">Editora</label>
                              <input type="text" required id='editora' name='editora' placeholder='Digite a editora do livro' defaultValue={modal.register?.livro.editora || ''}/>
                         </div>
                         <div className="label-input">
                              <label htmlFor="categoria_id">Categoria</label>
                              <select name="categoria_id" id="categoria_id" required defaultValue={modal.register?.livro.categoria_id || ''}>
                                   <option value="" disabled>Selecione uma opção</option>
                                   {categoriasAtivas.map((e) =>
                                        <option value={e.id}>{e.nome}</option>
                                   )}
                              </select>
                         </div>
                         <div className="label-input">
                              <label htmlFor="descricao">Descrição</label>
                              <textarea type="text" required id='descricao' name='descricao' placeholder='Digite a descricao do livro' defaultValue={modal.register?.livro.descricao || ''}/>
                         </div>
                         <div className="label-input">
                              <label htmlFor="editora">Autor</label>
                              <select name="autor_id" id="autor_id" required defaultValue={modal.register?.autor_id || ''}>
                                   <option value="" disabled>Selecione uma opção</option>
                                   {autoresAtivos.map((e) =>
                                        <option value={e.id}>{e.nome}</option>
                                   )}
                              </select>
                         </div>
                    </>
               )

               filtros = (
                    <>
                         <p>Filtros: </p>
                         <input onChange={(e) => setInputBuscaLivro(e.target.value)} type="text" placeholder='Pesquise por (Titulo,Autor,Categoria)'/>
                    </>
               )
               break;
     
          default:
               break;
     }

  return (
    <main id="home">
     <section className="title">
          <div className="box-title">
               <div>
                    <img src={logo} alt="logo" />
               </div>
               <div className="box-text">
                    <h1>Painel Administrativo</h1>
                    <p>Gerencie todos os recursos da plataforma</p>
               </div>
          </div>
          <button aria-label='sair' onClick={logout}>Sair</button>
     </section>

     <section className="cards">
          <article className="card">
               <div className="box-text">
                    <p>Total de titulos</p>
                    <p>{livrosAtivos.length}</p>
               </div>
               <div className="icone">
                    <i className="fa-solid fa-book"></i>
               </div>
          </article>
          <article className="card">
               <div className="box-text">
                    <p>Total de exemplares</p>
                    <p>{exemplaresAtivos.length}</p>
               </div>
               <div className="icone">
                    <i className="fa-solid fa-book-open"></i>
               </div>
          </article>
          <article className="card">
               <div className="box-text">
                    <p>Exemplares disponiveis</p>
                    <p>{exemplaresDisponiveis.length}</p>
               </div>
               <div className="icone">
                    <i className="fa-solid fa-check"></i>
               </div>
          </article>
          <article className="card">
               <div className="box-text">
                    <p>Exemplares emprestados</p>
                    <p>{exemplaresEmprestados.length}</p>
               </div>
               <div className="icone">
                    <i className="fa-solid fa-hand-holding"></i>
               </div>
          </article>
     </section>

     <section className="tabs-content">
          <div className="tabs">
               <button aria-label='tab' className={tab == 'autores' ? 'tab active' : 'tab'} onClick={() => setTab('autores')}>Autores</button>
               <button aria-label='tab' className={tab == 'categorias' ? 'tab active' : 'tab'} onClick={() => setTab('categorias')}>Categorias</button>
               <button aria-label='tab' className={tab == 'livros' ? 'tab active' : 'tab'} onClick={() => setTab('livros')}>Livros</button>
          </div>
     </section>

     <section className="box-filtros">
          <div className="box-text">
               <h2>Gerenciar {tab}</h2>
               <button disabled={!isAdmin} aria-label='adc' onClick={() => setModal({open:true,mode:'add',register:null})}>Adicionar</button>
          </div>
          <div className="filtros">
               {filtros}
          </div>
     </section>

     <section className="cards-content">
          {conteudo}
     </section>

      {error? <Toast tipo='error' message={error}/> : null}
      {msg? <Toast tipo='message' message={msg}/> : null}
      {modal.open? <Modal titulo={modal.mode == 'att' ? `Editar ${tab}` : `Adicionar ${tab}`} onClose={() => setModal({open:false, mode:'add',register:null})} onSubmit={enviarFormulario} formulario={formulario}/> : null}
    </main>
  )
}

export default Home
