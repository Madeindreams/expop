declare module 'yamljs' {
    interface YAML {
        load(filePath: string): unknown;
        parse(yamlString: string): unknown;
        stringify(data: unknown, inline?: number, spaces?: number): string;
    }

    const yaml: YAML;
    export = yaml;
}
