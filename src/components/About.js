import React, { useEffect } from "react";

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main>
        <div className="container">
          <h2 className="heading-2  tc">About Us</h2>
          <p className="text-lorem">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
            quibusdam libero commodi! A cumque id pariatur vel nihil ad
            perspiciatis excepturi, ipsa quam consectetur, ipsum molestias
            exercitationem commodi facilis natus corporis earum nobis dolorum,
            placeat at dolores! Corporis ratione tempora debitis, ab ducimus
            quos neque aliquam, voluptatem similique vero dolor. Ratione
            excepturi esse accusamus eveniet voluptatum enim eum tempora nisi
            nobis saepe, maiores doloremque praesentium quisquam autem. Sit
            nihil iusto, recusandae amet facere adipisci? Doloremque facilis
            ducimus aperiam consequuntur iure consectetur. Id totam debitis
            quibusdam, harum alias magni nobis aut inventore. At praesentium
            quibusdam necessitatibus cumque, recusandae quod asperiores sunt
            quisquam fugit corrupti suscipit placeat, distinctio eos soluta quas
            ducimus est excepturi eaque rem modi libero. Quasi nesciunt iusto
            ipsam eligendi repudiandae at consequatur molestias dolore, odit
            porro recusandae maxime iure, earum illo eius delectus quia optio
            minima iste quae nisi, vero voluptatem labore? Officia libero
            quidem, impedit voluptatibus sunt eveniet debitis itaque! A fugit
            eaque, dicta corporis delectus eos repudiandae consectetur quas
            distinctio, illo nihil cupiditate eveniet soluta incidunt quia
            doloremque non sequi perferendis dignissimos cumque nam similique
            molestias est earum? Blanditiis dolore labore laborum nostrum
            laudantium, sit est dolor iste delectus, ab voluptates placeat,
            asperiores corporis reprehenderit inventore.
          </p>
        </div>
      </main>
    </>
  );
}

export default About;
