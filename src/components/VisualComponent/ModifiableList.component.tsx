import React, { useEffect, useState } from 'react';

//Custom components
import Button from './Button.component.tsx';

//Props
import { ModifiableListProps } from '../../props/ModifiableList.props.tsx';

const ModifiableList = (modifiable_list: ModifiableListProps) => {

    const [modifiableList, setModifiableList] = useState<ModifiableListProps>(modifiable_list);

    useEffect(() => {
        setModifiableList(modifiable_list)
    }, [modifiable_list]);
    return (
        <div>
            <h3>{modifiableList.title}</h3>
            <table>
                <tr>
                    <th>
                        Value
                    </th>
                    <th >
                        Action
                    </th>
                </tr>
                {
                    modifiableList.listItems.map((item) => {
                        return (<>
                            <tr>
                                <td>
                                    {item.label}
                                </td>
                                <td>
                                    <Button label='Edit' type='Edit' onClickHandler={()=>{}}></Button>
                                </td>
                                <td>
                                    <Button label='Delete' type='Delete' onClickHandler={()=>{}}></Button>
                                </td>
                            </tr>
                        </>)
                    })
                }
            </table>
        </div>
    );
};

export default ModifiableList;
