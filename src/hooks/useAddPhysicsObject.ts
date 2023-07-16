import { useObjectStore } from '@/state/objects/objects'
import { RefObject, useEffect } from 'react'
import { BufferGeometry, Material, Mesh, NormalBufferAttributes } from 'three'

export const useAddPhysicsObject = ({
  ref,
}: {
  ref: RefObject<
    Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]>
  >
}) => {
  const { addObject } = useObjectStore()

  useEffect(() => {
    if (!ref.current) return
    addObject(ref.current)
  }, [ref, addObject])
}
