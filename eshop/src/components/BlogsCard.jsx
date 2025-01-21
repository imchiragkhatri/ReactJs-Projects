
import axios from "axios";
import { useEffect, useState } from "react"

export function BlogCard(){
    const [posts, setPosts] = useState([]);

    const getPosts = ()=> {
        axios.get('https://dummyjson.com/posts?sortBy=id&order=desc&limit=4')
        .then(res=> {
            setPosts(res.data.posts);
           // console.log(res.data.posts);
        });
    }
    useEffect(()=> {
        getPosts();
    },[])
    return(
        <div className="container mb-5 blog-section">
        <h1 className="mb-5 text-center">Latest Blog</h1>
        <div className="row row-cols-1 row-cols-md-2 g-4">
        {
                posts.map((post,index)=> 
                    <div className="col" data-id={post.id} key={post.id+'_'+index}>
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">{post.title}</h4>
                                <p className="card-text">
                                {post.body}
                                </p>
                                <p>
                                <span className="bi bi-eye-fill text-dark"> { post.views}</span>
                                <span className="bi bi-hand-thumbs-up-fill text-primary mx-3"> { post.reactions.likes}</span>
                                <span className="bi bi-hand-thumbs-down-fill text-danger"> { post.reactions.dislikes}</span>
                                
                                </p>
                                {post.tags.map(tag => <span key={tag} className="badge text-bg-dark mx-1">{tag}</span>)}
                                
                            </div>
                            
                        </div>
                    </div>
                )
            }
        </div>
      </div>
    )
}