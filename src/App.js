import React from 'react'
import { useRoutes, navigate, A, usePath, useInterceptor } from 'hookrouter'

const NavItem = ({ children, href, path }) => (
  <li>
    <A href={href} style={{ backgroundColor: path === href ? 'yellow' : 'transparent' }}>
      {children}
    </A>
  </li>
)

const Layout = ({ children }) => {
  const path = usePath()

  return (
    <React.Fragment>
      <header>
        <nav>
          <ul style={{ display: 'flex', gap: '1em', listStyleType: 'none', padding: 0 }}>
            <NavItem href="/" path={path}>Form</NavItem>
            <NavItem href="/redirect" path={path}>Redirect</NavItem>
            <NavItem href="/other" path={path}>Other</NavItem>
          </ul>
        </nav>
      </header>
      <hr />
      {children}
    </React.Fragment>
  )
}

function intercept(currentPath, nextPath) {
  if (confirm("Abandon changes?")) { // eslint-disable-line no-restricted-globals
    return nextPath
  }
  return currentPath
}

const FormPage = () => {
  useInterceptor(intercept)

  return (
    <main>
      <h1>Form page</h1>
      <p>Imagine a form with unsaved changes is here. When submitting the form
        we stop the interceptor; this works fine.</p>
      <p>If you click to navigate to the "other" page you'll get a confirmation
        dialog, which works as expected whichever option is chosen.</p>
      <p>If you click to navigate to the "redirect" page, which then redirects
        you to the "other" page, you'll get the confirmation dialog once on the
        first navigation intent, and then again when it redirects you to the
        "other" page. This second dialog is what I want to avoid.</p>
    </main>
  )
}

const RedirectPage = () => {
  navigate('/other')
  return (
    <main>
      Navigating... (you'll see this if you click "yes" and then "no")
    </main>
  )
}

const OtherPage = () => <main><h1>Other page</h1></main>
const NotFoundPage = () => <main><h1>Not found</h1></main>

const routes = {
  '/': () => <FormPage />,
  '/redirect': () => <RedirectPage />,
  '/other' : () => <OtherPage />,
}

function App() {
  const routeResult = useRoutes(routes)
  return <Layout>{routeResult || <NotFoundPage />}</Layout>
}

export default App
