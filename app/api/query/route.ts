import generate from "@/app/utils/generate";

export async function POST(
  req: Request,
) {
  const { query } = await req.json();

  const response = await generate(query);

  const regex_book = /(def )?book_appointment\(reason(=.*)?\):?/g;
  const regex_call = /(def )?call_tele_healthclinic\(\):?/g;
  const regex_emergency = /(def )?emergency_call\(\):?/g;

  const action = response.match(regex_book) ? 'bookAppointment' 
  : response.match(regex_call) ? 'callTeleHealthclinic' 
  : response.match(regex_emergency) ? 'emergencyCall' : '';

  const response_clean = response.replace(regex_book, '').replace(regex_call, '').replace(regex_emergency, '');

  const payload = JSON.stringify({
    'message': response_clean,
    'action': action
  });

  console.log(payload);

  return new Response(payload)

}