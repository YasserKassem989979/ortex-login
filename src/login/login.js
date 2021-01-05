import { useState, useEffect } from 'react'
import styles from "./login.module.css"
import logo from "../assets/img/logo.png"
import axios from 'axios';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import PriceCard from "../components/priceCard"


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alwaysLogged, setAlwaysLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [email, setEmail] = useState("");
    const [data, setData] = useState(null);

    useEffect(() => {
        try {
            setIsLoading(true)
            //establish connection
            var ws = new WebSocket('ws://stream.tradingeconomics.com/?client=guest:guest');

            var openListener = ws.addEventListener("open", (e,) => {
                console.log("connection established")
                ws.send(JSON.stringify({ "topic": "subscribe", "to": "EURUSD:CUR" }))
                console.log("sent")
            })

            //listen to messages
            var messageListener = ws.addEventListener("message", (e) => {
                let priceData = JSON.parse(e.data);
                console.log(priceData)
                if (priceData && priceData.price) setIsLoading(false);
                if (priceData && priceData.dt) {
                    priceData.dt =
                        `${new Date(priceData.dt).getUTCMonth() + 1}/${new Date(priceData.dt).getUTCDate()} ${new Date(priceData.dt).getUTCHours()}:${new Date(priceData.dt).getUTCMinutes()}`;
                    setData(priceData)
                }
            })
        } catch (err) {
            console.log(err)
        }
        return () => {
            ws.removeEventListener("open", openListener);
            ws.removeEventListener("message", messageListener)
        }
    }, [])








    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await axios.post('/login', { username, password });
            console.log(result.data)
        } catch (err) {
            console.log(err)

        }
    }

    const resetPassword = () => {
        console.log("reset password")
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 col-lg-6 p-0">
                    <div className={styles.login_box}>
                        <div className="row">
                            <div className="col-12  mb-5 mt-3">
                                <img className={styles.logo} src={logo} alt="logo" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">username</label>
                                        <input
                                            value={username}
                                            onChange={({ target: { value } }) => setUsername(value)}
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            placeholder="Email or Username" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input value={password} onChange={({ target: { value } }) => setPassword(value)} type="password" className="form-control" id="password" />
                                    </div>
                                    <div className="mb-3">
                                        <input checked={alwaysLogged} onChange={() => setAlwaysLogged(val => !val)} type="checkbox" id="always" />
                                        <label htmlFor="always" className="form-label mx-2">Keep me logged in</label>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className={`btn btn-primary py-2 ${styles.button}`} >
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="row my-3">
                            <div className="col-12 text-center">
                                <p onClick={() => setOpenModal(true)} className={styles.text}>Forget Password?</p>
                            </div>
                        </div>

                        <div className="row d-lg-none d-flex justify-content-center mt-3">
                            <PriceCard isLoading={isLoading} data={data} />
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-lg-6 d-none d-sm-none d-lg-block min-vh-100 d-flex jusify-content-center align-items-center">
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <PriceCard isLoading={isLoading} data={data} />
                    </div>

                </div>
            </div>
            <Modal
                showCloseIcon={false}
                open={openModal}
                onClose={() => setOpenModal(false)}
                center>
                <div className="row">
                    <div className="col-12">
                        <h4>Reset Password</h4>
                        <hr />
                        <p>Enter the email associated with your account and we'll send an email with instructions to reset your password</p>
                        <div className="mb-3">
                            <input
                                value={email}
                                onChange={({ target: { value } }) => setEmail(value)}
                                type="email"
                                className="form-control"
                                placeholder="name@example.com" />
                        </div>
                        <div className="d-grid gap-2">
                            <button onClick={resetPassword} className={`btn btn-primary ${styles.button}`} >
                                send email
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Login
