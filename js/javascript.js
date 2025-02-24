document.addEventListener("DOMContentLoaded", function () {
    let x = 0;
    let y = 1;
    let animating = false;
    let crta = 0;

    const colors = ["rgb(127, 172, 255)", "rgb(255, 127, 127)", "rgb(127, 255, 127)", "rgb(255, 255, 127)"];
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
        }
    }

    document.getElementById('start').addEventListener('click', function () {
        const canvas = document.getElementById('canvas');
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

//izbrisi


//izbrisi123
document.addEventListener("DOMContentLoaded", function (event) {
    let xdel = 0;
    let ydel = 1;
    let animatingdel = false;
    let crtadel = 0;

    function izbrisi() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        const resitev = [234,2, 234,10, 202,10, 202,42, 186,42, 186,138, 170,138, 170,122, 154,122, 154,138, 138,138, 138,202, 154,202, 154,218, 138,218, 138,250, 122,250, 122,266, 26,266, 26,282, 74,282, 74,298, 90,298, 90,314, 74,314, 74,330, 90,330, 90,346, 58,346, 58,362, 106,362, 106,346, 122,346, 122,330, 138,330, 138,362, 186,362, 186,282, 202,282, 202,330, 218,330, 218,346, 202,346, 202,378, 186,378, 186,394, 218,394, 218,410, 234,410, 234,442, 202,442, 202,458, 266,458, 266,474, 250,474, 250,482];

        input = document.querySelector("#myRange").value;
        speed = input;

        if (xdel < resitev.length - 2) {
            const startX = resitev[xdel];
            const startY = resitev[ydel];
            const endX = resitev[xdel + 2];
            const endY = resitev[ydel + 2];

            const dolzinaCrte = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

            crtadel += speed / dolzinaCrte;

            if (crtadel > 1) crtadel = 1;

            const vmesx = startX + (endX - startX) * crtadel;
            const vmesy = startY + (endY - startY) * crtadel;

            //possible fix ce se ze spet break-a
            //to rabim al pa ko enkrat zbrises ne upas narisat vec ubistvu z tem save restore sm nrdu tako da naredi majhno crtico na kateri izbrise vse in nato se tista crtica izbrises, ker ce se ne je vse kar hoces tam narisat nevidno ker uporabljam ctx.globalCompositeOperation = 'destination-out'
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';


            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(vmesx, vmesy);
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.closePath();


            ctx.beginPath();
            ctx.arc(startX, startY, ctx.lineWidth, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            //povezano z ctx.save
            ctx.restore();

            if (crtadel >= 1) {
                xdel += 2;
                ydel += 2;
                crtadel = 0;
            }

            requestAnimationFrame(izbrisi);
        } else {
            animatingdel = false;
            document.getElementById('start').disabled = false;
            document.getElementById('oboje').disabled = false;
            document.getElementById('sprite').disabled = false;
            document.getElementById('slika').disabled = false;
        }
    }

    document.getElementById('erase').addEventListener('click', function () {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        xdel = 0;
        ydel = 1;
        crtadel = 0;
        let input = document.querySelector("#myRange").value;
        speed = input;

        if (!animatingdel) {
            animatingdel = true;
            this.disabled = true;
            document.getElementById("start").disabled = true;
            document.getElementById("oboje").disabled = true;
            document.getElementById("sprite").disabled = true;
            document.getElementById("slika").disabled = true;
            izbrisi();
        }
    });
});

//oboje
document.addEventListener("DOMContentLoaded", function () {
    let x = 0;
    let y = 1;
    let animating = false;
    let crta = 0;
    
    const img = new Image();
    img.src = 'img/hdmi.png';

    function animatePath() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        const resitev = [234,2, 234,10, 202,10, 202,42, 186,42, 186,138, 170,138, 170,122, 154,122, 154,138, 138,138, 138,202, 154,202, 154,218, 138,218, 138,250, 122,250, 122,266, 26,266, 26,282, 74,282, 74,298, 90,298, 90,314, 74,314, 74,330, 90,330, 90,346, 58,346, 58,362, 106,362, 106,346, 122,346, 122,330, 138,330, 138,362, 186,362, 186,282, 202,282, 202,330, 218,330, 218,346, 202,346, 202,378, 186,378, 186,394, 218,394, 218,410, 234,410, 234,442, 202,442, 202,458, 266,458, 266,474, 250,474, 250,482];
        
        let speed = document.querySelector("#myRange").value;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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

            ctx.strokeStyle = "rgb(127, 172, 255)";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(vmesx, vmesy);
            ctx.stroke();
            ctx.closePath();

            ctx.fillStyle = "rgb(127, 172, 255)";
            ctx.fillRect(startX - ctx.lineWidth / 2, startY - ctx.lineWidth / 2, ctx.lineWidth, ctx.lineWidth);
            
            ctx.drawImage(img, vmesx - img.width / 2, vmesy - img.height / 2);
            
            if (crta >= 1) {
                x += 2;
                y += 2;
                crta = 0;
            }

            requestAnimationFrame(animatePath);
        } else {
            animating = false;
            document.querySelectorAll("button").forEach(btn => btn.disabled = false);
        }
    }

    document.getElementById('oboje').addEventListener('click', function () {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        x = 0;
        y = 1;
        crta = 0;
        
        if (!animating) {
            animating = true;
            document.querySelectorAll("button").forEach(btn => btn.disabled = true);
            this.disabled = true;
            animatePath();
        }
    });
});
