import { Link, useParams  } from "react-router-dom"
import { useAppContext } from "../store/AppProvider";
import { useEffect, useState } from "react";

const Breadcrumb =(props) => {
    const {state} = useAppContext();
    const {categories} = state;
    const {catid, pid} = useParams();
    const [catPath, setCatPath] = useState([]);
    

    useEffect(()=>{
        if(catid)
        {
            const getPath = categories.find((cat) =>  cat.slug === catid);
           // console.log(categories, catid);
            if(getPath){
                setCatPath(getPath);
            }
        }
    },[catid])

    return(
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                {pid ? (
                    <>
                        <li className="breadcrumb-item active" aria-current="page">
                            <Link to={`/${catPath.slug}`}>{catPath.name}</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">{props.title}</li>
                    </>
                    )
                : catid ? (
                    <>
                        <li className="breadcrumb-item active" aria-current="page">{catPath.name}</li>
                    </>
                    )
                :
                    <li className="breadcrumb-item active" aria-current="page">Favorites</li>
                }
                
            </ol>
        </nav>
    )
}

export default Breadcrumb;