import { getMessages } from "@/actions/admin";
import { MessagesClient } from "./MessagesClient";

export default async function MensajesPage() {
  const messages = await getMessages();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-4xl font-black tracking-tight text-white">
          Mensajes de Soporte
        </h1>
        <p className="text-on-surface-variant mt-2 text-lg">
          Gestiona los mensajes recibidos del formulario de contacto.
        </p>
      </div>

      <MessagesClient initialMessages={messages} />
    </div>
  );
}
