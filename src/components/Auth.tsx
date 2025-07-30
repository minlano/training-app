import { useState, useEffect } from 'react'
import { supabase } from '../shared/api/supabase'

interface CustomUser {
    id: string
    email: string
    created_at: string
}

interface AuthProps {
    onAuthChange: (user: CustomUser | null) => void
}

export const Auth: React.FC<AuthProps> = ({ onAuthChange }) => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 확인
        const savedUser = localStorage.getItem('customUser')
        if (savedUser) {
            onAuthChange(JSON.parse(savedUser))
        }
    }, [onAuthChange])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            if (isSignUp) {
                // 회원가입 - 자체 계정 테이블에 저장
                const { data, error } = await supabase
                    .from('accounts')
                    .insert([
                        {
                            email,
                            password_hash: password // 실제로는 해시화해야 함
                        }
                    ])
                    .select()

                if (error) throw error
                
                const newUser = data[0]
                localStorage.setItem('customUser', JSON.stringify(newUser))
                onAuthChange(newUser)
                setMessage('회원가입이 완료되었습니다!')
                setEmail('')
                setPassword('')
            } else {
                // 로그인 - 자체 계정 테이블에서 확인
                const { data, error } = await supabase
                    .from('accounts')
                    .select('*')
                    .eq('email', email)
                    .eq('password_hash', password)
                    .single()

                if (error || !data) {
                    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
                }

                localStorage.setItem('customUser', JSON.stringify(data))
                onAuthChange(data)
                setMessage('로그인 성공!')
                setEmail('')
                setPassword('')
            }
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        localStorage.removeItem('customUser')
        onAuthChange(null)
        setMessage('로그아웃되었습니다.')
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#111',
            width: '100%',
            overflow: 'hidden',
            fontFamily: '"Quicksand", sans-serif'
        }}>
            <div style={{
                position: 'relative',
                width: '500px',
                height: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* 회전하는 링들 */}
                <i style={{
                    position: 'absolute',
                    inset: 0,
                    border: '2px solid #fff',
                    borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
                    animation: 'animate 6s linear infinite',
                    transition: '0.5s'
                }}></i>
                <i style={{
                    position: 'absolute',
                    inset: 0,
                    border: '2px solid #fff',
                    borderRadius: '41% 44% 56% 59%/38% 62% 63% 37%',
                    animation: 'animate 4s linear infinite',
                    transition: '0.5s'
                }}></i>
                <i style={{
                    position: 'absolute',
                    inset: 0,
                    border: '2px solid #fff',
                    borderRadius: '41% 44% 56% 59%/38% 62% 63% 37%',
                    animation: 'animate2 10s linear infinite',
                    transition: '0.5s'
                }}></i>

                {/* 로그인 폼 */}
                <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <h2 style={{
                        fontSize: '2em',
                        color: '#fff'
                    }}>
                        {isSignUp ? 'Sign Up' : 'Login'}
                    </h2>

                    <form onSubmit={handleAuth} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        width: '100%'
                    }}>
                        {/* 이메일 입력 */}
                        <div style={{
                            position: 'relative',
                            width: '100%'
                        }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    padding: '12px 20px',
                                    background: 'transparent',
                                    border: '2px solid #fff',
                                    borderRadius: '40px',
                                    fontSize: '1.2em',
                                    color: '#fff',
                                    boxShadow: 'none',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div style={{
                            position: 'relative',
                            width: '100%'
                        }}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    padding: '12px 20px',
                                    background: 'transparent',
                                    border: '2px solid #fff',
                                    borderRadius: '40px',
                                    fontSize: '1.2em',
                                    color: '#fff',
                                    boxShadow: 'none',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* 제출 버튼 */}
                        <div style={{
                            position: 'relative',
                            width: '100%'
                        }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    padding: '12px 20px',
                                    background: 'linear-gradient(45deg, #ff357a, #fff172)',
                                    border: 'none',
                                    borderRadius: '40px',
                                    fontSize: '1.2em',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                            </button>
                        </div>
                    </form>

                    {/* 회원가입 링크 */}
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 20px'
                    }}>
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{
                                color: '#fff',
                                textDecoration: 'none',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1em'
                            }}
                        >
                            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
                        </button>
                    </div>

                    {/* 메시지 표시 */}
                    {message && (
                        <div style={{
                            color: message.includes('성공') || message.includes('완료') ? '#00ff0a' : '#ff0057',
                            fontSize: '0.9em',
                            textAlign: 'center',
                            maxWidth: '250px'
                        }}>
                            {message}
                        </div>
                    )}


                </div>
            </div>

            {/* CSS 애니메이션 스타일 */}
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap");
                
                @keyframes animate {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                
                @keyframes animate2 {
                    0% {
                        transform: rotate(360deg);
                    }
                    100% {
                        transform: rotate(0deg);
                    }
                }
                
                div:hover i {
                    border: 6px solid var(--clr);
                    filter: drop-shadow(0 0 20px var(--clr));
                }
                
                input::placeholder {
                    color: rgba(255, 255, 255, 0.75);
                }
            `}</style>
        </div>
    )
}