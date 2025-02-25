//sweetalert
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.sweet').addEventListener('click', function() {
        Swal.fire({
            title: 'Razvijalec',
            text: 'Nejc Vidmar',
            icon: 'info',
            confirmButtonText: 'Zapri',
            customClass: {
                confirmButton: 'swal-button',
            }
        });
    });
});

//narisi
document.addEventListener("DOMContentLoaded", function () {
    let x = 0;
    let y = 1;
    let animating = false;
    let crta = 0;

    const colors = ["rgb(200, 136, 46)", "rgb(60, 179, 113)", "rgb(70, 130, 180)", "rgb(255, 69, 0)"];
    const outerOffset = 4;
    const innerOffset = 3; 
    let speed = 1;
    let resitev;

    const speedSlider = document.querySelector("#myRange");
    const speedValue = document.querySelector("#speedValue");
    speedSlider.addEventListener('input', function() {
        speedValue.textContent = this.value;
    });
    
    function narisi() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        
        if (!resitev) {
            resitev = [234,2, 234,10, 202,10, 202,42, 186,42, 186,138, 170,138, 170,122, 154,122, 154,138, 138,138, 138,202, 154,202, 154,218, 138,218, 138,250, 122,250, 122,266, 26,266, 26,282, 74,282, 74,298, 90,298, 90,314, 74,314, 74,330, 90,330, 90,346, 58,346, 58,362, 106,362, 106,346, 122,346, 122,330, 138,330, 138,362, 186,362, 186,282, 202,282, 202,330, 218,330, 218,346, 202,346, 202,378, 186,378, 186,394, 218,394, 218,410, 234,410, 234,442, 202,442, 202,458, 266,458, 266,474, 250,474, 250,482];
        }
        
        ctx.lineWidth = 1;
        speed = parseFloat(document.querySelector("#myRange").value);
        
        if (x < resitev.length - 2) {
            const startX = resitev[x];
            const startY = resitev[y];
            const endX = resitev[x + 2];
            const endY = resitev[y + 2];
            
            const prevX = x >= 2 ? resitev[x - 2] : startX;
            const prevY = y >= 2 ? resitev[y - 2] : startY;
            const nextX = x < resitev.length - 4 ? resitev[x + 4] : endX;
            const nextY = y < resitev.length - 4 ? resitev[y + 4] : endY;
            
            const dolzinaCrte = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
            const step = speed / dolzinaCrte;
            crta += step;
            
            if (crta > 1 || x >= resitev.length - 4) {
                crta = 1;
            }
            
            const vmesx = startX + (endX - startX) * crta;
            const vmesy = startY + (endY - startY) * crta;
            
            for (let i = 0; i < colors.length; i++) {
                ctx.strokeStyle = colors[i];
                ctx.beginPath();
                
                // Izračunaj razliko med končno in začetno točko
                const dx = endX - startX;
                const dy = endY - startY;
                const len = Math.sqrt(dx * dx + dy * dy);
                
                // Izračunaj razliko med začetno točko in prejšnjo točko
                const prevDx = startX - prevX;
                const prevDy = startY - prevY;
                const prevLen = Math.sqrt(prevDx * prevDx + prevDy * prevDy);
                
                // Izračunaj razliko med naslednjo točko in končno točko
                const nextDx = nextX - endX;
                const nextDy = nextY - endY;
                const nextLen = Math.sqrt(nextDx * nextDx + nextDy * nextDy);
                
                // Izračunaj pravokotne vektorje na začetku in koncu segmenta
                const perpStartX = -dy / len;
                const perpStartY = dx / len;
                
                const perpEndX = -dy / len;
                const perpEndY = dx / len;
                
                let startBisectorX = perpStartX;
                let startBisectorY = perpStartY;
                let endBisectorX = perpEndX;
                let endBisectorY = perpEndY;
                
                // Če je to prvi segment, nastavi začetni bisektor na pravokotni vektor prvega segmenta
                if (x === 0) {
                    const firstDx = resitev[2] - resitev[0];
                    const firstDy = resitev[3] - resitev[1];
                    const firstLen = Math.sqrt(firstDx * firstDx + firstDy * firstDy);
                    startBisectorX = -firstDy / firstLen;
                    startBisectorY = firstDx / firstLen;
                }
                
                // Če je to zadnji segment, nastavi končni bisektor na pravokotni vektor zadnjega segmenta
                if (x >= resitev.length - 4) {
                    const lastDx = resitev[resitev.length - 2] - resitev[resitev.length - 4];
                    const lastDy = resitev[resitev.length - 1] - resitev[resitev.length - 3];
                    const lastLen = Math.sqrt(lastDx * lastDx + lastDy * lastDy);
                    endBisectorX = -lastDy / lastLen;
                    endBisectorY = lastDx / lastLen;
                }
                
                // Če obstaja prejšnji segment, povpreči pravokotne vektorje prejšnjega in trenutnega segmenta
                if (prevLen > 0 && x !== 0) {
                    const prevPerpX = -prevDy / prevLen;
                    const prevPerpY = prevDx / prevLen;
                    startBisectorX = (prevPerpX + perpStartX) / 2;
                    startBisectorY = (prevPerpY + perpStartY) / 2;
                    const startBisectorLen = Math.sqrt(startBisectorX * startBisectorX + startBisectorY * startBisectorY);
                    startBisectorX /= startBisectorLen;
                    startBisectorY /= startBisectorLen;
                }
                
                // Če obstaja naslednji segment, povpreči pravokotne vektorje trenutnega in naslednjega segmenta
                if (nextLen > 0 && x < resitev.length - 4) {
                    const nextPerpX = -nextDy / nextLen;
                    const nextPerpY = nextDx / nextLen;
                    endBisectorX = (perpEndX + nextPerpX) / 2;
                    endBisectorY = (perpEndY + nextPerpY) / 2;
                    const endBisectorLen = Math.sqrt(endBisectorX * endBisectorX + endBisectorY * endBisectorY);
                    endBisectorX /= endBisectorLen;
                    endBisectorY /= endBisectorLen;
                }
                
                // Izračunaj skale za začetni in končni bisektor
                const startScale = x === 0 ? 1 : (1 / Math.abs(dx * startBisectorX + dy * startBisectorY) * len);
                const endScale = x >= resitev.length - 4 ? 1 : (1 / Math.abs(dx * endBisectorX + dy * endBisectorY) * len);
                
                // Izračunaj odmike za začetno in končno točko
                const offset = (i - 1.5) * innerOffset;
                const startOffsetX = startBisectorX * offset * startScale;
                const startOffsetY = startBisectorY * offset * startScale;
                const endOffsetX = endBisectorX * offset * endScale;
                const endOffsetY = endBisectorY * offset * endScale;
                
                // Izračunaj trenutni odmik glede na animacijo
                const t = crta;
                const currentOffsetX = startOffsetX + (endOffsetX - startOffsetX) * t;
                const currentOffsetY = startOffsetY + (endOffsetY - startOffsetY) * t;
                
                // Nariši črto z odmiki
                ctx.moveTo(startX + startOffsetX, startY + startOffsetY);
                ctx.lineTo(vmesx + currentOffsetX, vmesy + currentOffsetY);
                
                ctx.stroke();
                ctx.closePath();
            }
            
            // Če je animacija končana, premakni na naslednji segment
            if (crta >= 1) {
                x += 2;
                y += 2;
                crta = 0;
            }
            requestAnimationFrame(narisi);
        } else {
            animating = false;
            document.getElementById('start').disabled = false;
            document.getElementById('oboje').disabled = false;
            document.getElementById('erase').disabled = false;
        }
    }

    document.getElementById('start').addEventListener('click', function () {
        const canvas = document.getElementById('linesCanvas');
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        x = 0;
        y = 1;
        crta = 0;
        speed = parseFloat(document.querySelector("#myRange").value);
        if (!animating) {
            animating = true;
            this.disabled = true;
            document.getElementById("erase").disabled = true;
            document.getElementById("oboje").disabled = true;
            narisi();
        }
    });
});

//izbriši
document.addEventListener("DOMContentLoaded", function () {
    let x = 0;
    let y = 1;
    let animating = false;
    let crta = 0;
    let isReversing = false;
    let reverseX = 0;
    let reverseY = 1;
    let reverseCrta = 1;

    const colors = ["rgb(146, 109, 80)", "rgb(76, 153, 108)", "rgb(81, 139, 181)", "rgb(253, 141, 129)"];
    const outerOffset = 4;
    const innerOffset = 3; 
    let speed = 1;
    let resitev;

    const speedSlider = document.querySelector("#myRange");
    const speedValue = document.querySelector("#speedValue");
    speedSlider.addEventListener('input', function() {
        speed = parseFloat(this.value);
        speedValue.textContent = this.value;
    });
    
    function narisi() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        
        if (!resitev) {
            resitev = [234,2, 234,10, 202,10, 202,42, 186,42, 186,138, 170,138, 170,122, 154,122, 154,138, 138,138, 138,202, 154,202, 154,218, 138,218, 138,250, 122,250, 122,266, 26,266, 26,282, 74,282, 74,298, 90,298, 90,314, 74,314, 74,330, 90,330, 90,346, 58,346, 58,362, 106,362, 106,346, 122,346, 122,330, 138,330, 138,362, 186,362, 186,282, 202,282, 202,330, 218,330, 218,346, 202,346, 202,378, 186,378, 186,394, 218,394, 218,410, 234,410, 234,442, 202,442, 202,458, 266,458, 266,474, 250,474, 250,482];
        }
        
        ctx.lineWidth = 1;
        speed = parseFloat(document.querySelector("#myRange").value);
        
        if (x < resitev.length - 2) {
            const startX = resitev[x];
            const startY = resitev[y];
            const endX = resitev[x + 2];
            const endY = resitev[y + 2];
            
            const prevX = x >= 2 ? resitev[x - 2] : startX;
            const prevY = y >= 2 ? resitev[y - 2] : startY;
            const nextX = x < resitev.length - 4 ? resitev[x + 4] : endX;
            const nextY = y < resitev.length - 4 ? resitev[y + 4] : endY;
            
            const dolzinaCrte = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
            const step = speed / dolzinaCrte;
            crta += step;
            
            if (crta > 1 || x >= resitev.length - 4) {
                crta = 1;
            }
            
            const vmesx = startX + (endX - startX) * crta;
            const vmesy = startY + (endY - startY) * crta;
            
            for (let i = 0; i < colors.length; i++) {
                ctx.strokeStyle = colors[i];
                ctx.beginPath();
                
                const dx = endX - startX;
                const dy = endY - startY;
                const len = Math.sqrt(dx * dx + dy * dy);
                
                const prevDx = startX - prevX;
                const prevDy = startY - prevY;
                const prevLen = Math.sqrt(prevDx * prevDx + prevDy * prevDy);
                
                const nextDx = nextX - endX;
                const nextDy = nextY - endY;
                const nextLen = Math.sqrt(nextDx * nextDx + nextDy * nextDy);
                
                const perpStartX = -dy / len;
                const perpStartY = dx / len;
                
                const perpEndX = -dy / len;
                const perpEndY = dx / len;
                
                let startBisectorX = perpStartX;
                let startBisectorY = perpStartY;
                let endBisectorX = perpEndX;
                let endBisectorY = perpEndY;
                
                if (x === 0) {
                    const firstDx = resitev[2] - resitev[0];
                    const firstDy = resitev[3] - resitev[1];
                    const firstLen = Math.sqrt(firstDx * firstDx + firstDy * firstDy);
                    startBisectorX = -firstDy / firstLen;
                    startBisectorY = firstDx / firstLen;
                }
                
                if (x >= resitev.length - 4) {
                    const lastDx = resitev[resitev.length - 2] - resitev[resitev.length - 4];
                    const lastDy = resitev[resitev.length - 1] - resitev[resitev.length - 3];
                    const lastLen = Math.sqrt(lastDx * lastDx + lastDy * lastDy);
                    endBisectorX = -lastDy / lastLen;
                    endBisectorY = lastDx / lastLen;
                }
                
                if (prevLen > 0 && x !== 0) {
                    const prevPerpX = -prevDy / prevLen;
                    const prevPerpY = prevDx / prevLen;
                    startBisectorX = (prevPerpX + perpStartX) / 2;
                    startBisectorY = (prevPerpY + perpStartY) / 2;
                    const startBisectorLen = Math.sqrt(startBisectorX * startBisectorX + startBisectorY * startBisectorY);
                    startBisectorX /= startBisectorLen;
                    startBisectorY /= startBisectorLen;
                }
                
                if (nextLen > 0 && x < resitev.length - 4) {
                    const nextPerpX = -nextDy / nextLen;
                    const nextPerpY = nextDx / nextLen;
                    endBisectorX = (perpEndX + nextPerpX) / 2;
                    endBisectorY = (perpEndY + nextPerpY) / 2;
                    const endBisectorLen = Math.sqrt(endBisectorX * endBisectorX + endBisectorY * endBisectorY);
                    endBisectorX /= endBisectorLen;
                    endBisectorY /= endBisectorLen;
                }
                
                const startScale = x === 0 ? 1 : (1 / Math.abs(dx * startBisectorX + dy * startBisectorY) * len);
                const endScale = x >= resitev.length - 4 ? 1 : (1 / Math.abs(dx * endBisectorX + dy * endBisectorY) * len);
                
                const offset = (i - 1.5) * innerOffset;
                const startOffsetX = startBisectorX * offset * startScale;
                const startOffsetY = startBisectorY * offset * startScale;
                const endOffsetX = endBisectorX * offset * endScale;
                const endOffsetY = endBisectorY * offset * endScale;
                
                const t = crta;
                const currentOffsetX = startOffsetX + (endOffsetX - startOffsetX) * t;
                const currentOffsetY = startOffsetY + (endOffsetY - startOffsetY) * t;
                
                ctx.moveTo(startX + startOffsetX, startY + startOffsetY);
                ctx.lineTo(vmesx + currentOffsetX, vmesy + currentOffsetY);
                
                ctx.stroke();
                ctx.closePath();
            }
            
            if (crta >= 1) {
                x += 2;
                y += 2;
                crta = 0;
            }
            requestAnimationFrame(narisi);
        }
    }

    function reverseAnimation() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        
        if (!resitev) return;
        
        speed = parseFloat(document.querySelector("#myRange").value);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let segment = 0; segment <= reverseX; segment += 2) {
            const segX = segment;
            const segY = segment + 1;
            
            const startX = resitev[segX];
            const startY = resitev[segY];
            const endX = resitev[segX + 2];
            const endY = resitev[segY + 2];
            
            const prevX = segX >= 2 ? resitev[segX - 2] : startX;
            const prevY = segY >= 2 ? resitev[segY - 2] : startY;
            const nextX = segX < resitev.length - 4 ? resitev[segX + 4] : endX;
            const nextY = segY < resitev.length - 4 ? resitev[segY + 4] : endY;
            
            let currentX, currentY;
            
            if (segment === reverseX) {
                currentX = startX + (endX - startX) * reverseCrta;
                currentY = startY + (endY - startY) * reverseCrta;
            } else {
                currentX = endX;
                currentY = endY;
            }
            
            for (let i = 0; i < colors.length; i++) {
                ctx.strokeStyle = colors[i];
                ctx.beginPath();
                
                const dx = endX - startX;
                const dy = endY - startY;
                const len = Math.sqrt(dx * dx + dy * dy);
                
                const prevDx = startX - prevX;
                const prevDy = startY - prevY;
                const prevLen = Math.sqrt(prevDx * prevDx + prevDy * prevDy);
                
                const nextDx = nextX - endX;
                const nextDy = nextY - endY;
                const nextLen = Math.sqrt(nextDx * nextDx + nextDy * nextDy);
                
                const perpStartX = -dy / len;
                const perpStartY = dx / len;
                
                const perpEndX = -dy / len;
                const perpEndY = dx / len;
                
                let startBisectorX = perpStartX;
                let startBisectorY = perpStartY;
                let endBisectorX = perpEndX;
                let endBisectorY = perpEndY;
                
                if (segX === 0) {
                    const firstDx = resitev[2] - resitev[0];
                    const firstDy = resitev[3] - resitev[1];
                    const firstLen = Math.sqrt(firstDx * firstDx + firstDy * firstDy);
                    startBisectorX = -firstDy / firstLen;
                    startBisectorY = firstDx / firstLen;
                }
                
                if (segX >= resitev.length - 4) {
                    const lastDx = resitev[resitev.length - 2] - resitev[resitev.length - 4];
                    const lastDy = resitev[resitev.length - 1] - resitev[resitev.length - 3];
                    const lastLen = Math.sqrt(lastDx * lastDx + lastDy * lastDy);
                    endBisectorX = -lastDy / lastLen;
                    endBisectorY = lastDx / lastLen;
                }
                
                if (prevLen > 0 && segX !== 0) {
                    const prevPerpX = -prevDy / prevLen;
                    const prevPerpY = prevDx / prevLen;
                    startBisectorX = (prevPerpX + perpStartX) / 2;
                    startBisectorY = (prevPerpY + perpStartY) / 2;
                    const startBisectorLen = Math.sqrt(startBisectorX * startBisectorX + startBisectorY * startBisectorY);
                    startBisectorX /= startBisectorLen;
                    startBisectorY /= startBisectorLen;
                }
                
                if (nextLen > 0 && segX < resitev.length - 4) {
                    const nextPerpX = -nextDy / nextLen;
                    const nextPerpY = nextDx / nextLen;
                    endBisectorX = (perpEndX + nextPerpX) / 2;
                    endBisectorY = (perpEndY + nextPerpY) / 2;
                    const endBisectorLen = Math.sqrt(endBisectorX * endBisectorX + endBisectorY * endBisectorY);
                    endBisectorX /= endBisectorLen;
                    endBisectorY /= endBisectorLen;
                }
                
                const startScale = segX === 0 ? 1 : (1 / Math.abs(dx * startBisectorX + dy * startBisectorY) * len);
                const endScale = segX >= resitev.length - 4 ? 1 : (1 / Math.abs(dx * endBisectorX + dy * endBisectorY) * len);
                
                const offset = (i - 1.5) * innerOffset;
                const startOffsetX = startBisectorX * offset * startScale;
                const startOffsetY = startBisectorY * offset * startScale;
                const endOffsetX = endBisectorX * offset * endScale;
                const endOffsetY = endBisectorY * offset * endScale;
                
                let currentOffsetX, currentOffsetY;
                if (segment === reverseX) {
                    const t = reverseCrta;
                    currentOffsetX = startOffsetX + (endOffsetX - startOffsetX) * t;
                    currentOffsetY = startOffsetY + (endOffsetY - startOffsetY) * t;
                } else {
                    currentOffsetX = endOffsetX;
                    currentOffsetY = endOffsetY;
                }
                
                ctx.moveTo(startX + startOffsetX, startY + startOffsetY);
                ctx.lineTo(currentX + currentOffsetX, currentY + currentOffsetY);
                
                ctx.stroke();
                ctx.closePath();
            }
        }
        
        const dolzinaCrte = Math.sqrt((resitev[reverseX + 2] - resitev[reverseX]) ** 2 + 
                                    (resitev[reverseY + 2] - resitev[reverseY]) ** 2);
        const step = speed / dolzinaCrte;
        reverseCrta -= step;

        
        if (reverseCrta <= 0) {
            reverseCrta = 1;
            reverseX -= 2;
            reverseY -= 2;
        }

        if (reverseX >= 0) {
            requestAnimationFrame(reverseAnimation);
        } else {
            isReversing = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.getElementById('start').disabled = false;
            document.getElementById('oboje').disabled = false;
            document.getElementById('erase').disabled = false;
        }
    }

    document.getElementById('start').addEventListener('click', function () {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        x = 0;
        y = 1;
        crta = 0;
        if (!animating) {
            animating = true;
            requestAnimationFrame(narisi);
        }
    });

    document.getElementById('erase').addEventListener('click', function () {
        if (!isReversing && resitev) {
            isReversing = true;
            document.getElementById("start").disabled = true;
            document.getElementById("erase").disabled = true;
            document.getElementById("oboje").disabled = true;
            reverseX = resitev.length - 4;
            reverseY = resitev.length - 3;
            reverseCrta = 1;
            requestAnimationFrame(reverseAnimation);
        }
    });
});

//oboje
document.addEventListener("DOMContentLoaded", function () {
    let x = 0;
    let y = 1;
    let animating = false;
    let crta = 0;
  
    // Define 4 colors for the lines
    const colors = [
      "rgb(200, 136, 46)",
      "rgb(60, 179, 113)",
      "rgb(70, 130, 180)",
      "rgb(255, 69, 0)"
    ];
  
    // Preload the moving image (for example, hdmi.png)
    const img = new Image();
    img.src = '../img/ethernet.png';
    img.onload = () => console.log("Image loaded");
    img.onerror = () => console.error("Failed to load image");
  
    // Get the speed slider value
    const speedSlider = document.querySelector("#myRange");
  
    // Use two canvases:
    const linesCanvas = document.getElementById("linesCanvas");
    const linesCtx = linesCanvas.getContext("2d");
  
    const imageCanvas = document.getElementById("imageCanvas");
    const imageCtx = imageCanvas.getContext("2d");
  
    // Our path points array
    const resitev = [
      234,2, 234,10, 202,10, 202,42, 186,42, 186,138, 170,138, 170,122,
      154,122, 154,138, 138,138, 138,202, 154,202, 154,218, 138,218, 138,250,
      122,250, 122,266, 26,266, 26,282, 74,282, 74,298, 90,298, 90,314,
      74,314, 74,330, 90,330, 90,346, 58,346, 58,362, 106,362, 106,346,
      122,346, 122,330, 138,330, 138,362, 186,362, 186,282, 202,282, 202,330,
      218,330, 218,346, 202,346, 202,378, 186,378, 186,394, 218,394, 218,410,
      234,410, 234,442, 202,442, 202,458, 266,458, 266,474, 250,474, 250,482
    ];
  
    function moveImage() {
      // Get the current speed from the slider (as a number)
      const speed = parseFloat(speedSlider.value);
  
      // IMPORTANT: Do NOT clear the lines canvas so that the colored lines remain.
      // Instead, clear only the image canvas.
      imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  
      if (x < resitev.length - 2) {
        const startX = resitev[x];
        const startY = resitev[y];
        const endX = resitev[x + 2];
        const endY = resitev[y + 2];
  
        const dolzinaCrte = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        crta += speed / dolzinaCrte;
        if (crta > 1) crta = 1;
  
        const vmesx = startX + (endX - startX) * crta;
        const vmesy = startY + (endY - startY) * crta;
  
        // ─── DRAW 4 LINES ON THE PERMANENT (lines) LAYER ───
        // We draw each line with a slight offset.
        for (let i = 0; i < colors.length; i++) {
          linesCtx.strokeStyle = colors[i];
          linesCtx.lineWidth = 1;
          linesCtx.beginPath();
          // Calculate an offset for each line (centered around zero)
          let offset = (i - 1.5) * 3; // Adjust the multiplier (3) as needed
          linesCtx.moveTo(startX + offset, startY + offset);
          linesCtx.lineTo(vmesx + offset, vmesy + offset);
          linesCtx.stroke();
          linesCtx.closePath();
        }
  
        // ─── DRAW THE MOVING IMAGE ON THE IMAGE LAYER ───
        if (img.complete && img.naturalWidth !== 0) {
          imageCtx.drawImage(img, vmesx - img.width / 2, vmesy - img.height / 2);
        }
  
        if (crta >= 1) {
          x += 2;
          y += 2;
          crta = 0;
        }
        requestAnimationFrame(moveImage);
      } else {
        animating = false;
        document.getElementById("start").disabled = false;
        document.getElementById("slika").disabled = false;
        document.getElementById("oboje").disabled = false;
      }
    }
  
    // When the "slika" button is clicked, start the animation.
    document.getElementById("oboje").addEventListener("click", function () {
      // Clear both canvases when starting
      linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
      imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
      x = 0;
      y = 1;
      crta = 0;
  
      if (!animating) {
        animating = true;
        this.disabled = true;
        document.getElementById("start").disabled = true;
        document.getElementById("oboje").disabled = true;
        document.getElementById("erase").disabled = true;
        moveImage();
      }
    });
  });
  