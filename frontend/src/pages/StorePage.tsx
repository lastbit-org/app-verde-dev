import {
  Button,
  Card,
  Checkbox,
  ChoiceGroup,
  Eyebrow,
  Field,
  Input,
  Paragraph,
  Quote,
  Radio,
  Section,
  Select,
  Textarea,
  Title,
} from '../components'
import { products } from '../data/products'
import { AccountSection } from '../features/account/AccountSection'
import { CartSection } from '../features/cart/CartSection'
import { OrdersSection } from '../features/orders/OrdersSection'
import { useOrders } from '../features/orders/useOrders'
import { ProductsSection } from '../features/products/ProductsSection'
import { UsersSection } from '../features/users/UsersSection'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function StorePage() {
  const { orders, loading, error, addOrder } = useOrders()

  return (
    <AppChrome>
      <main id="topo">
        <section className="hero">
          <Eyebrow>Design guide</Eyebrow>
          <Title as="h1">Uma interface quieta, em verde.</Title>
          <Paragraph variant="lead">
            Referência visual da loja: tipografia, controles e espaçamento. Pouca
            cor, bastante ar e um verde que não grita.
          </Paragraph>
        </section>

        <Section id="tipografia" eyebrow="Tipografia" title="Títulos e texto">
          <Paragraph>
            Títulos em <strong>Fraunces</strong>, corpo em <em>Figtree</em>.
            Parágrafos respiram e o contraste fica no peso, não no volume de
            cor.
          </Paragraph>
          <Title as="h3">Subtítulo da seção</Title>
          <Paragraph>
            Use um parágrafo para explicar o produto, a política ou o próximo
            passo. Links como <a href="#formulario">este aqui</a> herdam o verde
            da marca.
          </Paragraph>
          <Title as="h4">Rótulo menor</Title>
          <Paragraph variant="muted">
            Texto auxiliar, legendas e notas. Menor, mais suave, ainda legível.
          </Paragraph>
        </Section>

        <Section id="botoes" eyebrow="Ações" title="Botões">
          <Paragraph>
            Uma ação principal por contexto. O restante fica em segundo plano.
          </Paragraph>
          <div className="row">
            <Button>Adicionar ao carrinho</Button>
            <Button variant="secondary">Ver detalhes</Button>
            <Button variant="ghost">Cancelar</Button>
            <Button disabled>Indisponível</Button>
          </div>
        </Section>

        <Section id="formulario" eyebrow="Formulário" title="Campos">
          <Paragraph>Bordas finas, foco visível, labels sempre presentes.</Paragraph>

          <form className="form" onSubmit={(event) => event.preventDefault()}>
            <Field label="Nome">
              <Input type="text" name="name" placeholder="Ana Silva" />
            </Field>

            <Field label="E-mail">
              <Input type="email" name="email" placeholder="ana@example.com" />
            </Field>

            <Field label="Categoria">
              <Select
                name="category"
                defaultValue=""
                placeholder="Selecione"
                options={[
                  { value: 'plantas', label: 'Plantas' },
                  { value: 'vasos', label: 'Vasos' },
                  { value: 'cuidados', label: 'Cuidados' },
                ]}
              />
            </Field>

            <Field label="Mensagem">
              <Textarea
                name="message"
                rows={4}
                placeholder="Conte o que você procura."
              />
            </Field>

            <ChoiceGroup legend="Preferências">
              <Checkbox name="newsletter" defaultChecked>
                Quero novidades por e-mail
              </Checkbox>
              <Radio name="contact" value="email" defaultChecked>
                Contato por e-mail
              </Radio>
              <Radio name="contact" value="phone">
                Contato por telefone
              </Radio>
            </ChoiceGroup>

            <div className="row">
              <Button type="submit">Enviar</Button>
              <Button type="reset" variant="ghost">
                Limpar
              </Button>
            </div>
          </form>
        </Section>

        <AccountSection />

        <OrdersSection orders={orders} loading={loading} error={error} />

        <Section id="conteudo" eyebrow="Conteúdo" title="Cards e citação">
          <Paragraph>
            Blocos simples para produto, aviso ou depoimento. Sem sombra.
          </Paragraph>

          <Card
            badge="Novo"
            title="Oliveira em vaso de cerâmica"
            description="Folhagem densa, irrigação espaçada. Um objeto quieto para mesa ou recuo da sala."
            price="R$ 186"
          />

          <Card
            badge="Peça única"
            title="Oliveira à janela"
            description="O mesmo objeto, agora com foto. A imagem ocupa o topo; o texto fica no recuo de sempre."
            price="R$ 248"
            image={products[0]}
          />

          <Quote>
            “Menos vitrine, mais cuidado. O verde entra como tom de fundo, não
            como enfeite.”
          </Quote>
        </Section>

        <ProductsSection />

        <CartSection onAddOrder={addOrder} />

        <UsersSection />
      </main>

      <PageFooter />
    </AppChrome>
  )
}
