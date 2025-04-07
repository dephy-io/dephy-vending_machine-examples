import { useEffect, useState } from 'react'
import { NamespacesUiModal, NamespacesUiTable } from './namespaces-ui'
import { useNamespacesDataAccess } from './namespaces-data-access'

export default function NamespacesFeature() {
  const { program, getAllNamespaceAccounts } = useNamespacesDataAccess()
  const [showModal, setShowModal] = useState(false)

  const [namespaces, setNamespaces] = useState<any>([])

  useEffect(() => {
    if (program) {
      fetchAllNamespaces()
    }
  }, [program])

  const fetchAllNamespaces = async () => {
    const allNamespaces = await getAllNamespaceAccounts()
    setNamespaces(allNamespaces)
  }

  return (
    <div className="space-y-4">
      <NamespacesUiModal show={showModal} hideModal={() => setShowModal(false)} onCreate={fetchAllNamespaces} />
      
      <div className="flex justify-between items-center">
        <div className="text-m font-medium text-gray-600">
          {namespaces.length} {namespaces.length === 1 ? 'Namespace' : 'Namespaces'}
        </div>
        <button 
          className="btn btn-xs lg:btn-md btn-primary"
          onClick={() => setShowModal(true)}
        >
          Create Namespace
        </button>
      </div>
      
      <NamespacesUiTable namespaces={namespaces} />
    </div>
  )
}
