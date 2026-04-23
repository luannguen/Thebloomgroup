import React from 'react';
import { Code, Terminal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AdvancedSettingsProps {
    settings: Record<string, string>;
    handleChange: (key: string, value: string) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ settings, handleChange }) => {

    return (
        <div className="space-y-6">
            <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Thận trọng khi chỉnh sửa</AlertTitle>
                <AlertDescription>
                    Khu vực này cho phép dán mã script trực tiếp vào Website (như Google Analytics, Facebook Pixel). 
                    Việc dán sai mã có thể làm hỏng giao diện hoặc làm treo website của bạn.
                </AlertDescription>
            </Alert>

            {/* Header Scripts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        Header Scripts
                    </CardTitle>
                    <CardDescription>Mã script sẽ được chèn vào trước thẻ đóng &lt;/head&gt;.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label>Custom Scripts (Header)</Label>
                        <Textarea
                            rows={8}
                            value={settings['header_scripts'] || ''}
                            onChange={(e) => handleChange('header_scripts', e.target.value)}
                            placeholder='<script>...</script>'
                            className="font-mono text-xs bg-slate-950 text-slate-50 border-slate-800"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Footer Scripts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        Footer Scripts
                    </CardTitle>
                    <CardDescription>Mã script sẽ được chèn vào trước thẻ đóng &lt;/body&gt;.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label>Custom Scripts (Footer)</Label>
                        <Textarea
                            rows={8}
                            value={settings['footer_scripts'] || ''}
                            onChange={(e) => handleChange('footer_scripts', e.target.value)}
                            placeholder='<script>...</script>'
                            className="font-mono text-xs bg-slate-950 text-slate-50 border-slate-800"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdvancedSettings;
