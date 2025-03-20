export default function QuizItem({
  sequenceNumber,
  question,
}: Readonly<{
  sequenceNumber: number;
  question: string;
}>) {
  return (
    <article className="quizitem
      w-1/2
      max-md:w-full
      pt-4 px-4
    ">
      <p>{sequenceNumber}. {question}</p>
    </article>
  );
}
