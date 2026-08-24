import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Eyebrow, Paragraph, Title } from "../components";
import { AuthForm } from "../features/auth/AuthForm";
import { safeNextPath } from "../features/auth/roles";
import { useSession } from "../features/auth/SessionProvider";
import { AppChrome, PageFooter } from "../layout/AppChrome";

export function LoginPage() {
  const { user, loading } = useSession();
  const [params] = useSearchParams();

  if (!loading && user) {
    return <Navigate to={safeNextPath(params.get("next"))} replace />;
  }

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Acesso</Eyebrow>
          <Title as="h1">Entrar ou criar conta.</Title>
          <Paragraph variant="lead">Entre com e-mail e senha.</Paragraph>
        </section>

        {loading ? <p className="status">Carregando sessão…</p> : <AuthForm />}

        <p className="login-back">
          <Link to="/">Voltar à loja</Link>
          {" · "}
          <Link to="/user">Ver conta</Link>
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  );
}
