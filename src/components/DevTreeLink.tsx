import { SocialNetwork } from "../types"
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

type DevTreeLinkProps ={
    link: SocialNetwork
}

export default function DevTreeLink({link}: DevTreeLinkProps) {
  const { attributes , listeners, setNodeRef, transform, transition } = useSortable({
    id: link.id
  })

  const style = {
    // animaciones que incluye la libreria
    transform: CSS.Transform.toString(transform),
    transition
  }
  return (
    <li
      ref={setNodeRef} 
      style={style} className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg"
      {... attributes}
      {...listeners}
    >
        <div
        className="w-12 h-12 bg-cover"
        style={{
          backgroundImage: `url('/social/icon_${link.name}.svg')`,
        }}
      ></div>
      <p className="capitalize">
        Visita mi: <span className="font-bold">{link.name}</span>
      </p>
    </li>
  )
}