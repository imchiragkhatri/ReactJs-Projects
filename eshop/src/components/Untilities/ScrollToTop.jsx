import { useEffect, useState } from "react"


export default function ScrollToTop(){
    const [isVisible, setVisible] = useState(false);

    const scrollTop = () => {
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
    }

    useEffect(()=> {
        const toggleVisibility = () => {
            if(window.scrollY > 150) {
                setVisible(true);
            }
            else {
                setVisible(false);
            }
        }

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility)
    },[])
    return(
        isVisible && (
            <button 
            onClick={scrollTop} 
            className="btnScrollTop bi bi-arrow-up-circle-fill"
            style={{position:'fixed', 
                    bottom:'30px',
                    right:'20px',
                    display: 'flex',
                    fontSize:'1.5em',
                    color:'#000000',
                    background:'none', border:'none' }}
            ></button>
        )
    )
}