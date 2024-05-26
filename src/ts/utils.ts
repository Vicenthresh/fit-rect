document.addEventListener("DOMContentLoaded", function(event) {
    // btn
    const btnCalcular = document.getElementById("btnCalcular") as HTMLButtonElement | null;
    // inputs
    const inputTechoY = document.getElementById("techoY") as HTMLInputElement | null;
    const inputTechoX = document.getElementById("techoX") as HTMLInputElement | null;
    const inputPanelY = document.getElementById("panelY") as HTMLInputElement | null;
    const inputPanelX = document.getElementById("panelX") as HTMLInputElement | null;
    // card
    const resCard = document.getElementById("resCard") as HTMLDivElement | null;
    const resValue = document.getElementById("resValue") as HTMLSpanElement | null;

    // input validation
    if (btnCalcular && inputTechoY && inputTechoX && inputPanelX && inputPanelY) {
        btnCalcular.addEventListener("click", (e) => {
            // get values and create rectangles
            const techoRect: Rect = {h: inputTechoY.valueAsNumber, w: inputTechoX.valueAsNumber}
            const panelRect: Rect = {h: inputPanelY.valueAsNumber, w: inputPanelX.valueAsNumber}

            // valiadate values
            if(techoRect.w && techoRect.h && panelRect.w && panelRect.h ){
                // get result
                const res:number = fitPanels(techoRect, panelRect)
                
                // show the result
                if(resCard && resValue){
                    resCard.classList.remove('hidden')
                    resValue.innerHTML = res.toString()
                }
            }
        });
    }
});

type Rect = {
    h: number,
    w: number
}

function fitPanels(techo:Rect, panel:Rect):number {
    // get number of rectangles to fit in each orientation
    const fit_1 = Math.floor(techo.w/panel.w)  * Math.floor(techo.h/panel.h)
    const fit_2 = Math.floor(techo.w/panel.h)  * Math.floor(techo.h/panel.w)

    // if none fit skip further calculations
    if (fit_1 === 0 && fit_2 === 0) {
        return 0;
    }

    let remaining_techoW_1: number = 0
    let remaining_techoH_1: number = 0
    let remaining_techoW_2: number = 0
    let remaining_techoH_2: number = 0
    
    // get remaining measures of orientation 1
    if(fit_1 > 0){
        remaining_techoW_1 = techo.w % panel.w == 0 ? techo.w : techo.w % panel.w
        remaining_techoH_1 = techo.h % panel.h == 0 ? techo.h : techo.h % panel.h
    }

    // get remaining measures of orientation 2
    if(fit_2 > 0){
        remaining_techoW_2 = techo.w % panel.h == 0 ? techo.w : techo.w % panel.h
        remaining_techoH_2 = techo.h % panel.w == 0 ? techo.h : techo.h % panel.w
    }

    // create new Rect from the remaining space
    const remainingRect_1: Rect = {h: remaining_techoH_1, w: remaining_techoW_1 }
    const remainingRect_2: Rect = {h: remaining_techoH_2, w: remaining_techoW_2 }

    // if remaining area is equal to techo it means, nothing remains
    if(remainingRect_1.w * remainingRect_1.h == techo.w * techo.h){
        return fit_1
    }

    if(remainingRect_2.w * remainingRect_2.h == techo.w * techo.h){
        return fit_2
    }

    // Check if there is enough remaining area to fit at least one more panel in both orientations
    const canFitMore_1 = remainingRect_1.w >= panel.w && remainingRect_1.h >= panel.h || remainingRect_1.w >= panel.h && remainingRect_1.h >= panel.w;
    const canFitMore_2 = remainingRect_2.w >= panel.w && remainingRect_2.h >= panel.h || remainingRect_2.w >= panel.h && remainingRect_2.h >= panel.w;

    // if it can fit more, call the function again with the new rectangle
    const totalFit_remaining_1 = canFitMore_1 ? fitPanels(remainingRect_1, panel) : 0;
    const totalFit_remaining_2 = canFitMore_2 ? fitPanels(remainingRect_2, panel) : 0;
    
    // add the total of fits for each orientations
    const totalFitOrientation_1 = fit_1 + totalFit_remaining_1
    const totalFitOrientation_2 = fit_2 + totalFit_remaining_2

    // return the greater number
    return Math.max(totalFitOrientation_1, totalFitOrientation_2);
}

// TODO show in a canvas the rectangles
