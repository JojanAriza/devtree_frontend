import DevTreeInput from "../components/DevTreeInput"
import { social } from "../data/social"
import { useEffect, useState } from "react"
import { isValidUrl } from "../utils"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUser } from "../api/DevTreeAPI"
import { SocialNetwork, User } from "../types"

export default function LinkTreeView() {  
  const [devTreeLinks, setDevTreeLinks] = useState(social)

  const queryClient = useQueryClient()
  const user : User =  queryClient.getQueryData(['user'])!
  

  const {mutate} = useMutation({
    mutationFn: updateUser,
    onSuccess: (data)=>{
      toast.success(data)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  useEffect(() => {
    const updatedData = devTreeLinks.map(item => {
      const userLInk = JSON.parse(user.links).find((link: SocialNetwork) => link.name === item.name)
      if (userLInk) {
        return {
          ...item, url: userLInk.url, enabled: userLInk.enabled
        }
      }
      return item
    })

    setDevTreeLinks(updatedData)


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? {...link, url: e.target.value} : link) //no modifica el estado original
    setDevTreeLinks(updatedLinks)

    // queryClient.setQueryData(['user'], (prevData : User) => {
    //   return{
    //     ...prevData,
    //     links: JSON.stringify(updatedLinks)
    //   }
    // }) almacena cualquier cosa
  }

  const links: SocialNetwork[] = JSON.parse(user.links)

  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map(link =>
      //  link.name === socialNetwork ? {...link, enabled: !link.enabled}: link
      {
        if(link.name === socialNetwork ) {
          if(isValidUrl(link.url)){
            return{...link, enabled: !link.enabled}
          }else{
            toast.error('URL no valida')
          }
        }
        return link
      }
    )
    setDevTreeLinks(updatedLinks)

    let updatedItems : SocialNetwork[] = []

    const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetwork)

    if (selectedSocialNetwork?.enabled) {

      const id = links.filter(link => link.id).length + 1
      
      if (links.some(link => link.name === socialNetwork)) {//si almenos uno es verdadero
        updatedItems = links.map(link => {
          if (link.name === socialNetwork) {
            return {
              ...link,
              enabled: true,
              id
            }
          }else{
            return link
          }
        })
        
      }else{
        const newItem = {
          ...selectedSocialNetwork,
          id
        }
        updatedItems = [...links, newItem]
      }

    }else{
      // updatedItems = links.filter(link => link.name !== socialNetwork) No actualiza los id
      const indexToUpdated = links.findIndex(link => link.name === socialNetwork)
      updatedItems = links.map(link => {
        if (link.name === socialNetwork) {
          return{
            ...link,
            id: 0,
            enabled: false
          }
        }else if(link.id > indexToUpdated && (indexToUpdated !== 0 && link.id === 1)){
          return{
            ...link,
            id: link.id - 1
          }
        }else{
          return link
        }
      })
    }

    //Almacena en la base de datos
    queryClient.setQueryData(['user'], (prevData : User) => {
      return{
        ...prevData,
        links: JSON.stringify(updatedItems)
      }
    })
  }


  return (
    <>
    <div className="space-y-5">
      {devTreeLinks.map( item => (
        <DevTreeInput 
          key={item.name} 
          item={item} 
          handleUrlChange={handleUrlChange}
          handleEnableLink={handleEnableLink}
          />
      ))}
      <button 
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold"
        onClick={() => mutate(queryClient.getQueryData(['user'])!)}
      >Guardar Cambios</button>
    </div>
    </>
  )
}