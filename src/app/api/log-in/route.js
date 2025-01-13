// api/log-in/route.js

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Parse the JSON body

    // Dummy users array with email and password
    const dummyUsers = [
      {
        email: "vigh03@meltymagic.com",
        password:
          "No matter what darkness or contradictions lie within the village, I am still Itachi Uchiha of the Leaf",
      },
      {
        email: "joham@meltymagic.com",
        password: "bluecity@48",
      },
      {
        email: "abhishek@meltymagic.com",
        password: "coffeeking@18",
      },
      {
        email: "bob.jones@example.com",
        password: "bob1234",
      },
      {
        email: "carol.white@example.com",
        password: "carolpass987",
      },
    ];

    // Validate the credentials against the dummy users
    const user = dummyUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ success: false }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    // Handle unexpected errors
    return new Response(
      JSON.stringify({ message: "An error occurred", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


// // api/log-in/route.js

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json(); // Parse the JSON body

//     // Hardcoded credentials
//     const hardcodedEmail = "thunderstyle.coffee@cloud.in";
//     const hardcodedPassword =
//       "No matter what darkness or contradictions lie within the village, I am still Itachi Uchiha of the Leaf";

//     // Validate credentials
//     if (email === hardcodedEmail && password === hardcodedPassword) {
//       return new Response(JSON.stringify({ success: true }), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } else {
//       return new Response(JSON.stringify({ success: false }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   } catch (error) {
//     // Handle unexpected errors
//     return new Response(
//       JSON.stringify({ message: "An error occurred", error: error.message }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }
