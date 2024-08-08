import React from 'react';


const DropdownMenu = ({id, iconClass, children, menuName, idShow}) => {
    return (
        <li className="nav-item" id="accordionExample">
            <div className="nav-link collapsed"
                // data-toggle="collapse"
                 data-bs-toggle="collapse"
                 aria-expanded="true"
                 data-bs-target={`#${id}`}
                 aria-controls={`#${id}`}>
                <i className="icon">{iconClass}</i>
                <span className="text">{menuName}</span>
            </div>

            <div className="row">
                <div className="col">
                    <div className="collapse"
                         id={id}
                         aria-controls={id}
                         data-bs-parent="#accordionExample"
                    >
                        <div className="collapse-inner rounded">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default DropdownMenu;