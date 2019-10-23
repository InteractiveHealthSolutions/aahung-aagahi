// Copyright 2019 Interactive Health Solutions
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA.
// You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html
//
// Interactive Health Solutions, hereby disclaims all copyright interest in the program `Aahung-Aagahi' written by the contributors.

// Contributors: Tahira Niazi

/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-07-30 12:09:35
 * @modify date 2019-07-30 12:09:35
 * @desc [description]
 */
import React from "react";
import { MDBCarousel, MDBCarouselCaption, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask, MDBContainer,MDBBtn  } from
"mdbreact";
import imga from "../img/img1png.png";
import lsbeImg from "../img/IW7png.png";

const CarouselPage = () => {
  return (
    <MDBContainer>
      <MDBCarousel
        activeItem={1}
        length={2}
        showControls={true}
        showIndicators={false}
        className="z-depth-1"
      >
        <MDBCarouselInner>
          <MDBCarouselItem itemId="1">
            <MDBView>
              <img
                className="d-block w-100"
                src={lsbeImg}
                height="520"
                alt="First slide"
              />
              {/* <MDBMask overlay="black-light" /> */}
              <MDBMask overlay="purple-light" className="flex-center">
      </MDBMask>
            </MDBView>
            <MDBCarouselCaption>
            <h3 className="h3-responsive">Promoting LSBE</h3>

            {/* <MDBBtn rounded outline href="https://www.aahung.org/" color="secondary" >Learn More</MDBBtn> */}
            <MDBBtn
                href="https://www.aahung.org/"
                target="_blank"
                color="secondary"
            >
            Learn More!
            </MDBBtn>
            <p>So every individual has greater comfort with their body</p>
          </MDBCarouselCaption>
          </MDBCarouselItem>
          <MDBCarouselItem itemId="2">
            <MDBView>
              <img
                className="d-block w-100"
                src={imga}
                height="520"
                alt="Third slide"
              />
              <MDBMask overlay="purple-light" className="flex-center">

      </MDBMask>
            </MDBView>
            <MDBCarouselCaption>
            <h3 className="h3-responsive">Promoting SRHR</h3>

            {/* <MDBBtn rounded outline href="https://www.aahung.org/" color="secondary" >Learn More</MDBBtn> */}
            <MDBBtn
                href="https://www.aahung.org/"
                target="_blank"
                color="secondary"
            >
            Learn More!
            </MDBBtn>
            <p>So every individual has greater comfort with their body</p>
          </MDBCarouselCaption>
          </MDBCarouselItem>
        </MDBCarouselInner>
      </MDBCarousel>
    </MDBContainer>
  );
}

export default CarouselPage;
