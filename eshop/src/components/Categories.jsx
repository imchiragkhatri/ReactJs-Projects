import { Link } from 'react-router-dom';
import categories from "../menu-categories.json"; // Import JSON file


export function Categories(props){
    const {navClass} = props;
    return(
      
      <ul className={navClass}>
        {categories.map((category, index) => (
          <li className="menu-item" key={index} data-bs-dismiss={navClass !== 'menu' ? 'offcanvas' : undefined}>
          {category.items ? (
            <>
              <span  className="toggle" data-toggle="submenu">
                {category.name}{" "}
                <span className="arrow">&#11206;</span>
              </span>
              <ul className="submenu">
                {category.items.map((subItem) => (
                  <li key={subItem.slug}>
                    <Link to={`/${subItem.url}`} >{subItem.name}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Link to={`/${category.url}`}>{category.name}</Link>
          )}
        </li>
        ))}
      </ul>
    )
}