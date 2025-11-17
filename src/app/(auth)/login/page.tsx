import { login } from './actions';

export default function LoginPage() {
    return (
        <form action="">
            <button formAction={login}>Sign up</button>
        </form>
    )
}
