import { Button } from '@/components/ui/button'
import React from 'react'

function Modal() {
  return (
<dialog id="my_modal_1" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Hello!</h3>
    <p className="py-4">Press ESC key or click the button below to close</p>
    <div className="modal-action">
      <form method="dialog">
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

        {/* if there is a button in form, it will close the modal */}
        <Button>Valider</Button>
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>  )
}

export default Modal