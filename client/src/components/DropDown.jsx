import React, { useState } from 'react'

const DropDown = ({data}) => {
    const [selected,setSelected]=useState("all")
    const [isOpen,setIsOpen]=useState(false)
    const exchange=["all","Binance","Bybit","Okx",]
    const filteredOpt=selected=== "all" ? data : data.filter((d)=>(d.exchange===selected))
  return (
    <div className='' >

    </div>
  )
}

export default DropDown