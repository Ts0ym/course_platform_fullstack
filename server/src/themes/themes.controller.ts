import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {ThemesService} from "./themes.service";
import {CreateThemeDto} from "./themes.dto";
import {THEMES_COLLECTION_NAME} from "../constants";

@Controller(THEMES_COLLECTION_NAME)
export class ThemesController {
    constructor(private themeService: ThemesService) {}

    @Get(":id")
    getOne(@Param("id") id : string){
        return this.themeService.getOne(id)
    }

    @Get()
    getAll(){
        return this.themeService.getAll()
    }

    @Post()
    create(@Body() dto: CreateThemeDto){
        return this.themeService.create(dto)
    }

    @Delete(":id")
    delete(@Param('id') id : string){
        return this.themeService.delete(id)
    }

}
