export function InquiryForm() {
  return (
    <form className="inquiry-form">
      <label className="inquiry-field">
        <span>Имя</span>
        <input name="name" placeholder="Ваше имя" type="text" />
      </label>

      <label className="inquiry-field">
        <span>Email</span>
        <input name="email" placeholder="name@email.com" type="email" />
      </label>

      <label className="inquiry-field inquiry-field-full">
        <span>Запрос</span>
        <textarea name="message" placeholder="Напишите, какая работа вас заинтересовала." rows={7} />
      </label>

      <button className="inquiry-submit" type="submit">
        Отправить запрос
      </button>
    </form>
  );
}
