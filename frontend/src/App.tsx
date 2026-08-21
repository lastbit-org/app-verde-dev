function App() {
  return (
    <div className="page">
      <header className="header">
        <a className="brand" href="#topo">
          <span className="brand-mark" aria-hidden="true" />
          Verde
        </a>
        <nav className="nav" aria-label="Seções">
          <a href="#tipografia">Tipografia</a>
          <a href="#botoes">Botões</a>
          <a href="#formulario">Formulário</a>
          <a href="#conteudo">Conteúdo</a>
        </nav>
      </header>

      <main id="topo">
        <section className="hero">
          <p className="eyebrow">Design guide</p>
          <h1>Uma interface quieta, em verde.</h1>
          <p className="lead">
            Referência visual da loja: tipografia, controles e espaçamento. Pouca
            cor, bastante ar e um verde que não grita.
          </p>
        </section>

        <section id="tipografia" className="block">
          <p className="eyebrow">Tipografia</p>
          <h2>Títulos e texto</h2>
          <p>
            Títulos em <strong>Fraunces</strong>, corpo em{' '}
            <em>Figtree</em>. Parágrafos respiram e o contraste fica no peso, não
            no volume de cor.
          </p>
          <h3>Subtítulo da seção</h3>
          <p>
            Use um parágrafo para explicar o produto, a política ou o próximo
            passo. Links como{' '}
            <a href="#formulario">este aqui</a> herdam o verde da marca.
          </p>
          <h4>Rótulo menor</h4>
          <p className="muted">
            Texto auxiliar, legendas e notas. Menor, mais suave, ainda legível.
          </p>
        </section>

        <section id="botoes" className="block">
          <p className="eyebrow">Ações</p>
          <h2>Botões</h2>
          <p>Uma ação principal por contexto. O restante fica em segundo plano.</p>
          <div className="row">
            <button type="button" className="btn btn-primary">
              Adicionar ao carrinho
            </button>
            <button type="button" className="btn btn-secondary">
              Ver detalhes
            </button>
            <button type="button" className="btn btn-ghost">
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" disabled>
              Indisponível
            </button>
          </div>
        </section>

        <section id="formulario" className="block">
          <p className="eyebrow">Formulário</p>
          <h2>Campos</h2>
          <p>Bordas finas, foco visível, labels sempre presentes.</p>

          <form className="form" onSubmit={(event) => event.preventDefault()}>
            <label className="field">
              <span>Nome</span>
              <input type="text" name="name" placeholder="Ana Silva" />
            </label>

            <label className="field">
              <span>E-mail</span>
              <input type="email" name="email" placeholder="ana@example.com" />
            </label>

            <label className="field">
              <span>Categoria</span>
              <select name="category" defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                <option value="plantas">Plantas</option>
                <option value="vasos">Vasos</option>
                <option value="cuidados">Cuidados</option>
              </select>
            </label>

            <label className="field">
              <span>Mensagem</span>
              <textarea
                name="message"
                rows={4}
                placeholder="Conte o que você procura."
              />
            </label>

            <fieldset className="choices">
              <legend>Preferências</legend>
              <label className="choice">
                <input type="checkbox" name="newsletter" defaultChecked />
                Quero novidades por e-mail
              </label>
              <label className="choice">
                <input type="radio" name="contact" value="email" defaultChecked />
                Contato por e-mail
              </label>
              <label className="choice">
                <input type="radio" name="contact" value="phone" />
                Contato por telefone
              </label>
            </fieldset>

            <div className="row">
              <button type="submit" className="btn btn-primary">
                Enviar
              </button>
              <button type="reset" className="btn btn-ghost">
                Limpar
              </button>
            </div>
          </form>
        </section>

        <section id="conteudo" className="block">
          <p className="eyebrow">Conteúdo</p>
          <h2>Card e citação</h2>
          <p>Blocos simples para produto, aviso ou depoimento.</p>

          <article className="card">
            <p className="badge">Novo</p>
            <h3>Oliveira em vaso de cerâmica</h3>
            <p>
              Folhagem densa, irrigação espaçada. Um objeto quieto para mesa ou
              recuo da sala.
            </p>
            <p className="price">R$ 186</p>
          </article>

          <blockquote>
            “Menos vitrine, mais cuidado. O verde entra como tom de fundo, não
            como enfeite.”
          </blockquote>
        </section>
      </main>

      <footer className="footer">
        <p>Verde · entrega inicial</p>
      </footer>
    </div>
  )
}

export default App
