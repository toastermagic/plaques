import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'sgHighlightPipe' })
export class HighlightPipe implements PipeTransform {

    transform(text: string, args: string[]): any {
        var filter: string = args[0];
        if (filter) {
            text = text.replace(
                    new RegExp('(' + filter + ')', 'gi'), '<span class="highlighted">$1</span>');
        }
        return text;
    }
}
