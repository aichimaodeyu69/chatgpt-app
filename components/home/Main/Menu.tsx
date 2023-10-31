'use client'
import Button from '@/components/common/Button'
import { useAppContext } from '@/components/AppContext'
import { LuPanelLeft } from 'react-icons/lu'
import { ActionType } from '@/reducers/AppReducer'

export default function Menu() {
    const {
        state: { displayNavigation },
        dispatch
    } = useAppContext()
    return < Button icon={LuPanelLeft} variant='outline'
        className={`${displayNavigation ? "hidden" : ""} fixed left-2 top-2`}
        onClick={() => {
            dispatch({ type: ActionType.UPDATE, field: "displayNavigation", value: true })
        }
        }
    />
}