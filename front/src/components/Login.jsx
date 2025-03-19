import React from 'react'

function Login() {
  return (
    <div>
        <h2 className='login_h2' >Login</h2>
        <form>
            <input type="text" placeholder="Usuário" required />
            <input type="password" placeholder="Senha" required />
            <button type="submit">Entrar</button>
        </form>
    </div>
  )
}

export default Login